// Console-based logger implementation
export const createLogger = () => ({
    info: (message, meta) => {
        console.log(`[INFO] ${message}`, meta ? JSON.stringify(meta, null, 2) : '');
    },
    warn: (message, meta) => {
        console.warn(`[WARN] ${message}`, meta ? JSON.stringify(meta, null, 2) : '');
    },
    error: (message, meta) => {
        console.error(`[ERROR] ${message}`, meta ? JSON.stringify(meta, null, 2) : '');
    },
    debug: (message, meta) => {
        if (process.env.NODE_ENV === 'development') {
            console.debug(`[DEBUG] ${message}`, meta ? JSON.stringify(meta, null, 2) : '');
        }
    }
});
