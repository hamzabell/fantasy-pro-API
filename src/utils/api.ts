import axios from 'axios';

const FPL_API_BASE_URL = 'https://fantasy.premierleague.com/api';

const handleError = (error: unknown): never => {
	if (axios.isAxiosError(error)) {
		throw new Error(`HTTP Error: ${error.response?.status} - ${error.response?.statusText}`);
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
			headers,
		});

		return response.data;
	} catch (error) {
		return handleError(error);
	}
};
