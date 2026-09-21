export const mailConfig = (() => {
  return {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT ? +process.env.MAIL_PORT : undefined,
    user: process.env.MAIL_USER,
    code: process.env.MAIL_AUTH_CODE
  }
})()
