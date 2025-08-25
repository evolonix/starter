import { User, UserImage } from '@prisma/client';

export type UserWithImage = User & { image: UserImage | null };
