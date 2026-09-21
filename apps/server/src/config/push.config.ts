export const pushConfig = (() => {
  // if (!process.env.VAPID_SUBJECT) {
  //   throw new Error('VAPID_SUBJECT is not exist')
  // }
  // if (!process.env.VAPID_PUBLIC_KEY) {
  //   throw new Error('VAPID_PUBLIC_KEY is not exist')
  // }
  // if (!process.env.VAPID_PUBLIC_KEY) {
  //   throw new Error('VAPID_PRIVATE_KEY is not exist')
  // }

  return {
    subject: process.env.VAPID_SUBJECT,
    publicKey: process.env.VAPID_PUBLIC_KEY,
    privateKey: process.env.VAPID_PRIVATE_KEY
  }
})()
