// Logger interface for functional logging
export interface Logger {
	info: (message: string, meta?: Record<string, unknown>) => void
	warn: (message: string, meta?: Record<string, unknown>) => void
	error: (message: string, meta?: Record<string, unknown>) => void
	debug: (message: string, meta?: Record<string, unknown>) => void
}

// Console-based logger implementation
export const createLogger = (context?: string): Logger => ({
	info: (message: string, meta?: Record<string, unknown>) => {
        const prefix = context ? `[${context}] ` : '';
		console.log(`[INFO] ${prefix}${message}`, meta ? JSON.stringify(meta, null, 2) : '')
	},
	warn: (message: string, meta?: Record<string, unknown>) => {
        const prefix = context ? `[${context}] ` : '';
		console.warn(`[WARN] ${prefix}${message}`, meta ? JSON.stringify(meta, null, 2) : '')
	},
	error: (message: string, meta?: Record<string, unknown>) => {
        const prefix = context ? `[${context}] ` : '';
		console.error(`[ERROR] ${prefix}${message}`, meta ? JSON.stringify(meta, null, 2) : '')
	},
	debug: (message: string, meta?: Record<string, unknown>) => {
		if (process.env.NODE_ENV === 'development') {
            const prefix = context ? `[${context}] ` : '';
			console.debug(`[DEBUG] ${prefix}${message}`, meta ? JSON.stringify(meta, null, 2) : '')
		}
	}
})
