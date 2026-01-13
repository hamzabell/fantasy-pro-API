import axios from 'axios';
import https from 'https';

const FPL_API_BASE_URL = 'https://fantasy.premierleague.com/api';

const handleError = (error: unknown): never => {
	if (axios.isAxiosError(error)) {
        const message = error.response 
            ? `HTTP Error: ${error.response.status} - ${error.response.statusText}`
            : `Network/Axios Error: ${error.message}`;
		throw new Error(message);
	}
	throw new Error(`Unexpected Error: ${String(error)}`);
};

export const fetchJson = async <T>(
	endpoint: string,
	options: { method?: 'GET' | 'POST' | 'PUT' | 'DELETE'; params?: Record<string, any>; headers?: Record<string, string> } = {},
): Promise<T> => {
    const { method = 'GET', params, headers } = options;
    const url = new URL(`${FPL_API_BASE_URL}${endpoint}`);

    if (params) {
        Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, String(value)));
    }

    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
        try {
            attempts++;
            const response = await axios({
                url: url.toString(),
                method,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    ...headers
                },
                httpsAgent: new https.Agent({ keepAlive: true }),
                timeout: 30000 // 30s timeout (Increased from 10s)
            });

            return response.data;
        } catch (error) {
            const isLastAttempt = attempts === maxAttempts;
            
            // Don't retry 4xx client errors (except 429 if we wanted to handle rate limits specifically, but usually better to fail fast)
            if (axios.isAxiosError(error) && error.response && error.response.status >= 400 && error.response.status < 500) {
                 return handleError(error);
            }

            if (isLastAttempt) {
                return handleError(error);
            }
            
            console.warn(`[API] Fetch failed for ${endpoint}. Retrying (${attempts}/${maxAttempts})... Error: ${error instanceof Error ? error.message : String(error)}`);
            // Simple linear backoff: 1s, 2s...
            await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
        }
    }
    throw new Error('Unexpected unreachable code in fetchJson');
};
