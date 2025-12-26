import type { AppEnvironment } from '../fp/infrastructure/Environment.js'
import type { User } from '../generated/prisma/index.js'

// Extend Hono's context variables
declare module 'hono' {
	interface ContextVariableMap {
		env: AppEnvironment
		user: User
	}
}
