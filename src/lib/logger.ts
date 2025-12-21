type LogLevel = "debug" | "info" | "warn" | "error";

interface LogObject {
    [key: string]: any;
}

const levelOrder: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
};

function getLogLevelFromEnv(): LogLevel {
    const envLevel = process.env.LOG_LEVEL?.toLowerCase();
    if (envLevel && ["debug", "info", "warn", "error"].includes(envLevel)) {
        return envLevel as LogLevel;
    }
    return "info";
}

export function createLogger(context: string) {
    const logLevel = getLogLevelFromEnv();

    function shouldLog(level: LogLevel) {
        return levelOrder[level] >= levelOrder[logLevel];
    }

    function format(level: LogLevel, message: string, obj?: LogObject) {
        const time = new Date().toISOString();
        const base = `[${time}] [${context}] [${level.toUpperCase()}] ${message}`;
        return obj ? `${base} ${JSON.stringify(obj)}` : base;
    }

    return {
        debug(message: string, obj?: LogObject) {
            if (shouldLog("debug")) console.debug(format("debug", message, obj));
        },
        info(message: string, obj?: LogObject) {
            if (shouldLog("info")) console.info(format("info", message, obj));
        },
        warn(message: string, obj?: LogObject) {
            if (shouldLog("warn")) console.warn(format("warn", message, obj));
        },
        error(message: string, obj?: LogObject) {
            if (shouldLog("error")) console.error(format("error", message, obj));
        },
    };
}
