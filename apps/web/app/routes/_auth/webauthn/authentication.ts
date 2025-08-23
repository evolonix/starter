import {
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import { getSessionExpirationDate } from '../../../utils/auth.server';
import { prisma } from '../../../utils/db.server';
import { handleNewSession } from '../login.server';
import {
  PasskeyLoginBodySchema,
  getWebAuthnConfig,
  passkeyCookie,
} from './utils.server.js';

export async function loader({ request }: LoaderFunctionArgs) {
  const config = getWebAuthnConfig(request);
  const options = await generateAuthenticationOptions({
    rpID: config.rpID,
    userVerification: 'preferred',
  });

  const cookieHeader = await passkeyCookie.serialize({
    challenge: options.challenge,
  });

  return Response.json(
    { options },
    { headers: { 'Set-Cookie': cookieHeader } },
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const cookieHeader = request.headers.get('Cookie');
  const cookie = await passkeyCookie.parse(cookieHeader);
  const deletePasskeyCookie = await passkeyCookie.serialize('', { maxAge: 0 });
  try {
    if (!cookie?.challenge) {
      throw new Error('Authentication challenge not found');
    }

    const body = await request.json();
    const result = PasskeyLoginBodySchema.safeParse(body);
    if (!result.success) {
      throw new Error('Invalid authentication response');
    }
    const { authResponse, remember, redirectTo } = result.data;

    const passkey = await prisma.passkey.findUnique({
      where: { id: authResponse.id },
      include: { user: true },
    });
    if (!passkey) {
      throw new Error('Passkey not found');
    }

    const config = getWebAuthnConfig(request);

    const verification = await verifyAuthenticationResponse({
      response: authResponse,
      expectedChallenge: cookie.challenge,
      expectedOrigin: config.origin,
      expectedRPID: config.rpID,
      credential: {
        id: authResponse.id,
        publicKey: passkey.publicKey,
        counter: Number(passkey.counter),
      },
    });

    if (!verification.verified) {
      throw new Error('Authentication verification failed');
    }

    // Update the authenticator's counter in the DB to the newest count
    await prisma.passkey.update({
      where: { id: passkey.id },
      data: { counter: BigInt(verification.authenticationInfo.newCounter) },
    });

    const session = await prisma.session.create({
      select: { id: true, expirationDate: true, userId: true },
      data: {
        expirationDate: getSessionExpirationDate(),
        userId: passkey.userId,
      },
    });

    const response = await handleNewSession(
      {
        request,
        session,
        remember,
        redirectTo: redirectTo ?? undefined,
      },
      { headers: { 'Set-Cookie': deletePasskeyCookie } },
    );

    return Response.json(
      {
        status: 'success',
        location: response.headers.get('Location'),
      },
      { headers: response.headers },
    );
  } catch (error) {
    if (error instanceof Response) throw error;

    return Response.json(
      {
        status: 'error',
        error: error instanceof Error ? error.message : 'Verification failed',
      } as const,
      { status: 400, headers: { 'Set-Cookie': deletePasskeyCookie } },
    );
  }
}
