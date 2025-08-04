import { constants, promises as fs } from 'node:fs';
import { getImgResponse } from 'openimg/node';
import { LoaderFunctionArgs } from 'react-router';
import { prisma } from '../../utils/db.server';
import { getDomainUrl } from '../../utils/misc';
import {
  getProfileImage,
  getSignedGetRequestInfo,
} from '../../utils/storage.server';

let cacheDir: string | null = null;

async function getCacheDir() {
  if (cacheDir) return cacheDir;

  let dir = './_openimg';
  const isAccessible = await fs
    .access('/data', constants.W_OK)
    .then(() => true)
    .catch(() => false);

  if (isAccessible) {
    dir = '/data/images';
  }

  return (cacheDir = dir);
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { id } = params;
  if (!id) {
    throw new Response('User ID is required', {
      status: 400,
    });
  }

  const user = await prisma.user.findFirstOrThrow({
    where: { id },
    select: { image: true },
  });
  if (!user.image?.objectKey) {
    throw new Response('User does not have an avatar', {
      status: 404,
    });
  }

  if (process.env.NODE_ENV === 'development') {
    const file = await getProfileImage(user.image.objectKey);

    if (!file) {
      throw new Response('User avatar not found', {
        status: 404,
      });
    }

    return new Response(file.stream(), {
      headers: {
        'Content-Type': file.type,
        'Content-Disposition': `attachment; filename=${file.name}`,
      },
    });
  }

  const headers = new Headers();
  headers.set('Cache-Control', 'public, max-age=31536000, immutable');

  return getImgResponse(request, {
    headers,
    allowlistedOrigins: [
      getDomainUrl(request),
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      process.env.AWS_ENDPOINT_URL_S3!,
    ].filter(Boolean),
    cacheFolder: await getCacheDir(),
    getImgSource: () => {
      if (user.image?.objectKey) {
        const { url: signedUrl, headers: signedHeaders } =
          getSignedGetRequestInfo(user.image.objectKey);
        return {
          type: 'fetch',
          url: signedUrl,
          headers: signedHeaders,
        };
      }

      throw new Response('User does not have an avatar', {
        status: 404,
      });
    },
  });
}
