/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { ConsoleLogger, Injectable, LogLevel } from '@nestjs/common'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'
import { access, mkdir, appendFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { inspect } from 'node:util'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Shanghai')

const isString = (val: unknown): val is string => typeof val === 'string'
const isUndefined = (obj: unknown): obj is undefined => typeof obj === 'undefined'
const isFunction = (val: unknown): val is CallableFunction => typeof val === 'function'
const isNil = (val: unknown): val is null | undefined => isUndefined(val) || val === null
const isObject = (fn: unknown): fn is object => !isNil(fn) && typeof fn === 'object'
const isPlainObject = (fn: unknown): fn is object => {
  if (!isObject(fn)) {
    return false
  }
  const proto = Object.getPrototypeOf(fn)
  if (proto === null) {
    return true
  }
  const ctor = Object.prototype.hasOwnProperty.call(proto, 'constructor') && proto.constructor
  return (
    typeof ctor === 'function' &&
    ctor instanceof ctor &&
    Function.prototype.toString.call(ctor) === Function.prototype.toString.call(Object)
  )
}

function isStackFormat(stack: unknown) {
  if (!isString(stack) && !isUndefined(stack)) {
    return false
  }
  return /^(.)+\n\s+at .+:\d+:\d+/.test(stack as string)
}

@Injectable()
export class AppLogger extends ConsoleLogger {
  saveLogLevels?: LogLevel[]

  setSaveLogLevels(saveLogLevels: LogLevel[]) {
    this.saveLogLevels = saveLogLevels
  }

  private getContextAndMessages(args: unknown[]) {
    if (args?.length <= 1) {
      return { messages: args, context: this.context }
    }
    const lastElement = args[args.length - 1]
    const isContext = isString(lastElement)
    if (!isContext) {
      return { messages: args, context: this.context }
    }
    return {
      context: lastElement,
      messages: args.slice(0, args.length - 1)
    }
  }
  private getContextAndStackAndMessages(args: unknown[]) {
    if (args.length === 2) {
      return isStackFormat(args[1])
        ? {
            messages: [args[0]],
            stack: args[1] as string,
            context: this.context
          }
        : {
            messages: [args[0]],
            context: args[1] as string
          }
    }

    const { messages, context } = this.getContextAndMessages(args)
    if (messages?.length <= 1) {
      return { messages, context }
    }
    const lastElement = messages[messages.length - 1]
    const isStack = isString(lastElement)

    if (!isStack && !isUndefined(lastElement)) {
      return { messages, context }
    }
    console.log(
      {
        messages,
        lastElement
      },
      'lastElement'
    )
    return {
      stack: lastElement,
      messages: messages.slice(0, messages.length - 1),
      context
    }
  }

  isSaveLevelEnabled(level: LogLevel): boolean {
    if (!this.saveLogLevels) return false
    return this.saveLogLevels.includes(level)
  }

  stringifySaveMessage(message: unknown) {
    if (isFunction(message)) {
      const messageAsStr = Function.prototype.toString.call(message)
      const isClass = messageAsStr.startsWith('class ')
      if (isClass) {
        // If the message is a class, we will display the class name.
        return this.stringifySaveMessage(message.name)
      }
      // If the message is a non-class function, call it and re-resolve its value.
      return this.stringifySaveMessage(message())
    }

    if (typeof message === 'string') {
      return message
    }

    const outputText = inspect(message, Object.assign(this.inspectOptions, { colors: false }))
    if (isPlainObject(message)) {
      return `Object(${Object.keys(message).length}) ${outputText}`
    }
    if (Array.isArray(message)) {
      return `Array(${message.length}) ${outputText}`
    }
    return outputText
  }

  async saveLog(level: LogLevel, message: unknown, ...optionalParams: unknown[]) {
    if (!this.isSaveLevelEnabled(level)) return

    const { messages, context, stack } = this.getContextAndStackAndMessages([message, ...optionalParams])
    const time = dayjs()
    const msgs = messages.map(msg => this.stringifySaveMessage(msg))
    let logMessage = `[${time.format('YYYY-MM-DD HH:mm:ss')}] [${level}] [${context}]: ${msgs.join('\n')}`
    if (stack) {
      logMessage += `\nStack trace: ${stack}`
    }
    logMessage += '\n\n'
    const logFilePath = join(import.meta.dirname, `../logs`, `${time.format('YYYY-MM-DD')}.log`)
    const logDir = dirname(logFilePath)

    try {
      await access(logDir)
    } catch {
      await mkdir(logDir, { recursive: true })
    } finally {
      await appendFile(logFilePath, logMessage)
    }
  }

  log(message: unknown, ...optionalParams: unknown[]) {
    super.log(message, ...optionalParams)
    void this.saveLog('log', message, ...optionalParams)
  }

  error(message: unknown, ...optionalParams: unknown[]) {
    super.error(message, ...optionalParams)
    void this.saveLog('error', message, ...optionalParams)
  }

  warn(message: unknown, ...optionalParams: unknown[]) {
    super.warn(message, ...optionalParams)
    void this.saveLog('warn', message, ...optionalParams)
  }

  debug(message: unknown, ...optionalParams: unknown[]) {
    super.debug(message, ...optionalParams)
    void this.saveLog('debug', message, ...optionalParams)
  }

  verbose(message: unknown, ...optionalParams: unknown[]) {
    super.verbose(message, ...optionalParams)
    void this.saveLog('verbose', message, ...optionalParams)
  }

  fatal(message: unknown, ...optionalParams: unknown[]) {
    super.fatal(message, ...optionalParams)
    void this.saveLog('fatal', message, ...optionalParams)
  }
}
