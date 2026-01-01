// Console-based logger implementation
export const createLogger = (context) => ({
    info: (message, meta) => {
        const prefix = context ? `[${context}] ` : '';
        console.log(`[INFO] ${prefix}${message}`, meta ? JSON.stringify(meta, null, 2) : '');
    },
    warn: (message, meta) => {
        const prefix = context ? `[${context}] ` : '';
        console.warn(`[WARN] ${prefix}${message}`, meta ? JSON.stringify(meta, null, 2) : '');
    },
    error: (message, meta) => {
        const prefix = context ? `[${context}] ` : '';
        console.error(`[ERROR] ${prefix}${message}`, meta ? JSON.stringify(meta, null, 2) : '');
    },
    debug: (message, meta) => {
        if (process.env.NODE_ENV === 'development') {
            const prefix = context ? `[${context}] ` : '';
            console.debug(`[DEBUG] ${prefix}${message}`, meta ? JSON.stringify(meta, null, 2) : '');
        }
    }
});
