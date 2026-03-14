import { SetMetadata } from '@nestjs/common';
export const IS_PUBLIC_KEY = 'isPublic'; // اجعلها camelCase لتجنب الأخطاء
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);