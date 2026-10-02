let lastSrcs: string[]

async function extractNewScripts() {
  const res = await fetch('/?_timestamp=' + Date.now())
  if (!res.ok) {
    throw new Error(`fetch html failed: ${res.status}`)
  }
  const html = await res.text()
  const matches = html.matchAll(/<script[^>]*\ssrc=["'](?<src>[^"']+)["']/gi)
  return [...matches].map(m => m.groups?.src).filter(src => src !== undefined)
}

async function checkUpdate() {
  const newScripts = await extractNewScripts()
  if (!lastSrcs) {
    lastSrcs = newScripts
    return false
  }
  let result = false
  if (lastSrcs.length !== newScripts.length) {
    result = true
  }
  for (let i = 0; i < lastSrcs.length; i++) {
    if (lastSrcs[i] !== newScripts[i]) {
      result = true
      break
    }
  }
  lastSrcs = newScripts
  return result
}

export type AutoUpdateOptions = {
  onUpdate: () => Promise<void> | void
  duration?: number
}
export function autoUpdate({ onUpdate, duration = 30000 }: AutoUpdateOptions) {
  async function autoCheck() {
    const needUpdate = await checkUpdate()
    if (needUpdate) await onUpdate()
    setTimeout(autoCheck, duration)
  }
  setTimeout(autoCheck, duration)
}
