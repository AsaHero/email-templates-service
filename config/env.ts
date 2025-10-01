export const ENV = {
  baseUrl: process.env.NEXT_PUBLIC_CDN_HOST ? `${process.env.NEXT_PUBLIC_CDN_HOST}/public/emails` : '/static',
};
