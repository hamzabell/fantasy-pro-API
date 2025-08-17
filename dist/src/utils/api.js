var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from 'axios';
const FPL_API_BASE_URL = 'https://fantasy.premierleague.com/api';
const handleError = (error) => {
    var _a, _b;
    if (axios.isAxiosError(error)) {
        throw new Error(`HTTP Error: ${(_a = error.response) === null || _a === void 0 ? void 0 : _a.status} - ${(_b = error.response) === null || _b === void 0 ? void 0 : _b.statusText}`);
    }
    throw new Error(`Unexpected Error: ${String(error)}`);
};
export const fetchJson = (endpoint_1, ...args_1) => __awaiter(void 0, [endpoint_1, ...args_1], void 0, function* (endpoint, options = {}) {
    try {
        const { method = 'GET', params, headers } = options;
        const url = new URL(`${FPL_API_BASE_URL}${endpoint}`);
        if (params) {
            Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, String(value)));
        }
        const response = yield axios({
            url: url.toString(),
            method,
            headers,
        });
        return response.data;
    }
    catch (error) {
        return handleError(error);
    }
});
