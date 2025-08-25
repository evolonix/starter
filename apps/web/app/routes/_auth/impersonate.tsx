import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from 'react-router';

import {
  getImpersonator,
  impersonatorSessionKey,
  sessionKey,
} from '../../utils/auth.server';
import { prisma } from '../../utils/db.server';
import { requireUserWithRole } from '../../utils/permissions.server';
import { authSessionStorage } from '../../utils/session.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const id = await requireUserWithRole(request, 'admin');

  if (!id) {
    return redirect('/');
  }

  return redirect('/admin/users');
}

export async function action({ request }: ActionFunctionArgs) {
  const { commitSession, getSession } = authSessionStorage;
  const body = await request.formData();
  const intent = body.get('intent') as string;

  if (intent !== 'start' && intent !== 'stop')
    throw new Error('invalid intent');

  const cookieSession = await getSession(request.headers.get('cookie'));

  if (intent === 'start') {
    const userId = body.get('userId')?.toString();

    if (!userId) throw new Error('Must provide a userId');

    const id = await requireUserWithRole(request, 'admin');

    if (userId === id) throw new Error('Self impersonation not allowed');

    const currentSessionId = cookieSession.get(sessionKey);

    const impersonatorSession = await prisma.session.create({
      data: {
        userId: userId,
        expirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      },
    });

    cookieSession.set(impersonatorSessionKey, currentSessionId);
    cookieSession.set(sessionKey, impersonatorSession.id);
    const newCookie = await authSessionStorage.commitSession(cookieSession, {
      expires: impersonatorSession.expirationDate,
    });

    return redirect('/', {
      headers: { 'Set-Cookie': newCookie },
    });
  }

  if (intent === 'stop') {
    const impersonator = await getImpersonator(request);

    if (!impersonator)
      throw new Error('Must be impersonating to stop impersonating');

    cookieSession.set(sessionKey, impersonator.session.id);
    cookieSession.unset(impersonatorSessionKey);

    const newCookie = await commitSession(cookieSession, {
      expires: impersonator.session.expirationDate,
    });

    return redirect('/admin/users', {
      headers: { 'Set-Cookie': newCookie },
    });
  }

  return null;
}
