export const apiConfig = (() => {
  const port = Number(process.env.SERVER_PORT ?? 3000)
  return {
    port,
    serverUrl: process.env.SERVER_URL ?? `http://localhost:${port}`,
    enableConsumer: Boolean(process.env.ENABLE_CONSUMER)
  }
})()
