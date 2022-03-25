import winston from 'winston'
import chalk from 'chalk'

type Level = 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug' | 'silly'

function getChalkFunction(level: Level) {
  switch (level) {
    case 'error':
      return chalk.redBright
    case 'warn':
      return chalk.yellow
    case 'info':
      return chalk.white
    case 'debug':
      return chalk.blueBright
    default:
      return chalk.white
  }
}

export default winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'productivity-api' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:MM:SS',
        }),
        winston.format.printf((info) => {
          const chalkFunction = getChalkFunction(info.level as Level)
          return chalkFunction(
            `[${info.timestamp}] - ${info.level.toUpperCase()} - ${
              info.message
            }`
          )
        })
      ),
    }),
  ],
})
