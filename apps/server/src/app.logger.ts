import { styleText, inspect, stripVTControlCharacters, type InspectColor } from 'node:util'
import { access, mkdir, appendFile } from 'fs/promises'
import { join, dirname } from 'path'
import dayjs, { type Dayjs } from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Shanghai')

type LogLevel = 'log' | 'debug' | 'warn' | 'error'

const logLevelColorMap: Record<LogLevel, InspectColor | `#${string}`> = {
  log: 'green',
  debug: 'blue',
  warn: 'yellow',
  error: 'red'
}

export class AppLogger {
  saveLogLevels?: LogLevel[]
  setSaveLogLevels(saveLogLevels: LogLevel[]) {
    this.saveLogLevels = saveLogLevels
  }
  isSaveLevelEnabled(level: LogLevel): boolean {
    if (!this.saveLogLevels) return false
    return this.saveLogLevels.includes(level)
  }
  async saveLog(time: Dayjs, ...messages: any[]) {
    const logFilePath = join(import.meta.dirname, `../logs`, `${time.format('YYYY-MM-DD')}.log`)
    const logDir = dirname(logFilePath)

    let logMessage = `${messages
      .map(msg => {
        if (typeof msg === 'string') return stripVTControlCharacters(msg)
        if (msg instanceof Error) return msg.stack ?? msg.message
        try {
          return inspect(msg, { depth: 5, colors: false, compact: false })
        } catch {
          return String(msg)
        }
      })
      .join(' ')}`

    logMessage += '\n'

    try {
      await access(logDir)
    } catch {
      await mkdir(logDir, { recursive: true })
    } finally {
      await appendFile(logFilePath, logMessage)
    }
  }

  getTimeAndMessages(logLevel: LogLevel, ...data: any[]) {
    const time = dayjs()
    const messages = [
      styleText('dim', `[${time.format('YYYY-MM-DD HH:mm:ss')}]`),
      styleText(logLevelColorMap[logLevel], `[${logLevel.toUpperCase()}]`),
      ...data
    ]
    return {
      time,
      messages
    }
  }
  log(...data: any[]) {
    const { time, messages } = this.getTimeAndMessages('log', ...data)
    console.log(...messages)
    if (!this.isSaveLevelEnabled('log')) return
    void this.saveLog(time, ...messages)
  }
  debug(...data: any[]) {
    const { time, messages } = this.getTimeAndMessages('debug', ...data)
    console.log(...messages)
    if (!this.isSaveLevelEnabled('debug')) return
    void this.saveLog(time, ...messages)
  }
  warn(...data: any[]) {
    const { time, messages } = this.getTimeAndMessages('warn', ...data)
    console.log(...messages)
    if (!this.isSaveLevelEnabled('warn')) return
    void this.saveLog(time, ...messages)
  }
  error(...data: any[]) {
    const { time, messages } = this.getTimeAndMessages('error', ...data)
    console.log(...messages)
    if (!this.isSaveLevelEnabled('error')) return
    void this.saveLog(time, ...messages)
  }
}

export const appLogger = new AppLogger()

appLogger.setSaveLogLevels(['error'])
