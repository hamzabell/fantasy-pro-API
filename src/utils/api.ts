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
	try {
		const { method = 'GET', params, headers } = options;
		const url = new URL(`${FPL_API_BASE_URL}${endpoint}`);

		if (params) {
			Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, String(value)));
		}

		const response = await axios({
			url: url.toString(),
			method,
			headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                ...headers
            },
            httpsAgent: new https.Agent({ keepAlive: true }),
            timeout: 10000 // 10s timeout
		});

		return response.data;
	} catch (error) {
		return handleError(error);
	}
};
