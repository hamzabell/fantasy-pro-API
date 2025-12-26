// Logger interface for functional logging
export interface Logger {
	info: (message: string, meta?: Record<string, unknown>) => void
	warn: (message: string, meta?: Record<string, unknown>) => void
	error: (message: string, meta?: Record<string, unknown>) => void
	debug: (message: string, meta?: Record<string, unknown>) => void
}

// Console-based logger implementation
export const createLogger = (): Logger => ({
	info: (message: string, meta?: Record<string, unknown>) => {
		console.log(`[INFO] ${message}`, meta ? JSON.stringify(meta, null, 2) : '')
	},
	warn: (message: string, meta?: Record<string, unknown>) => {
		console.warn(`[WARN] ${message}`, meta ? JSON.stringify(meta, null, 2) : '')
	},
	error: (message: string, meta?: Record<string, unknown>) => {
		console.error(`[ERROR] ${message}`, meta ? JSON.stringify(meta, null, 2) : '')
	},
	debug: (message: string, meta?: Record<string, unknown>) => {
		if (process.env.NODE_ENV === 'development') {
			console.debug(`[DEBUG] ${message}`, meta ? JSON.stringify(meta, null, 2) : '')
		}
	}
})
