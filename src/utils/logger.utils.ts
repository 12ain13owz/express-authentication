import dayjs from 'dayjs'
import winston from 'winston'

import { Colors } from '@/constants/logger.constant'

// Function to create ANSI color string
function applyColor(value: unknown, colorCode: string): string {
  return `\x1b[${colorCode}m${String(value)}\x1b[0m`
}

// Function to handle array formatting
function formatArray(arr: unknown[], indent = 0): string {
  if (arr.length === 0) return '[]'

  const indentStr = ' '.repeat(indent)
  let result = '['

  arr.forEach((item, index) => {
    const formattedValue = formatAny(item, indent + 2)
    result += `\n${indentStr}  ${formattedValue}`
    if (index < arr.length - 1) result += ','
  })

  result += `\n${indentStr}]`
  return result
}

// Function to check if a key is an actual property of an object, preventing prototype pollution
function safeHasOwnProperty(
  obj: Record<string, unknown>,
  key: string
): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

// Function to safely retrieve a property from an object
function safeGetProperty(obj: Record<string, unknown>, key: string): unknown {
  if (safeHasOwnProperty(obj, key)) {
    const descriptor = Object.getOwnPropertyDescriptor(obj, key)
    return descriptor ? descriptor.value : undefined
  }

  return undefined
}

// Function to handle object formatting
function formatObject(obj: Record<string, unknown>, indent = 0): string {
  const ownKeys = Object.keys(obj)
  if (ownKeys.length === 0) return '{}'

  const indentStr = ' '.repeat(indent)
  let result = '{'

  ownKeys.forEach((key, index) => {
    const value = safeGetProperty(obj, key)
    const formattedValue = formatAny(value, indent + 2)

    result += `\n${indentStr} ${applyColor(
      `"${key}"`,
      Colors.FIELD
    )}: ${formattedValue}`
    if (index < ownKeys.length - 1) result += ','
  })

  result += `\n${indentStr}}`
  return result
}

// Function to handle formatting of primitive values
function formatPrimitive(value: unknown): string {
  if (typeof value === 'string') return applyColor(`"${value}"`, Colors.STRING)
  if (typeof value === 'number') return applyColor(value, Colors.NUMBER)
  if (typeof value === 'boolean') return applyColor(value, Colors.BOOLEAN)
  if (typeof value === 'function')
    return applyColor('function', Colors.FUNCTION)
  if (value === undefined) return applyColor('undefined', Colors.UNDEFINED)
  if (value === null) return applyColor('null', Colors.NULL)
  if (value instanceof Date) return applyColor(value.toISOString(), Colors.DATE)

  return String(value as unknown)
}

// Main function to handle formatting of any data type
function formatAny(value: unknown, indent = 0): string {
  if (value instanceof Date) return formatPrimitive(value)
  if (Array.isArray(value)) return formatArray(value, indent)
  if (typeof value === 'object' && value !== null)
    return formatObject(value as Record<string, unknown>, indent)

  return formatPrimitive(value)
}

// Function to handle color codes for different log levels
function getLevelColor(level: string): string {
  const validLevelKeys = ['info', 'warn', 'error', 'crit'] as const
  type LevelKey = (typeof validLevelKeys)[number]

  if (validLevelKeys.includes(level as LevelKey)) {
    return Colors[level.toUpperCase() as keyof typeof Colors]
  }

  return Colors.INFO // default fallback
}

// Create custom format for Winston
const colorizedFormat = winston.format.printf((info) => {
  const timestamp = dayjs().format('HH:mm:ss.SSS')
  const time = `[${timestamp}]`
  const levelUpper = info.level.toUpperCase()
  const levelColor = getLevelColor(info.level)
  const formattedLevel = applyColor(`${levelUpper}:`, levelColor)

  const message = info.message
  if (Array.isArray(message)) {
    const formattedMessage = message.map((item) => formatAny(item)).join(' ')
    return `${time} ${formattedLevel} ${formattedMessage}`
  }

  const formattedMessage = formatAny(message)
  return `${time} ${formattedLevel} ${formattedMessage}`
})

export const logger = winston.createLogger({
  level: 'info',
  levels: {
    crit: 0,
    error: 1,
    warn: 2,
    info: 3,
  },
  format: colorizedFormat,
  transports: [new winston.transports.Console()],
})
