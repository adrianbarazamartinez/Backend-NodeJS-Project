// Purpose: To create a logger that logs errors and info to two different files error.log and info.log.
import winston from "winston";

const logger = winston.createLogger({
    level:"error",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.prettyPrint(),
    ),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'info.log', level: 'info' }),
    ]
});

export default logger;