import axios, { AxiosPromise, AxiosRequestConfig } from "axios";
import getRedirectUri from "./getRedirectUri";

export default async function getAuthToken(
	code: string,
	client_id: string,
	code_verifier: string,
	test: boolean
): Promise<AxiosRequestConfig>;
export default async function getAuthToken(
	code: string,
	client_id: string,
	code_verifier: string
): Promise<AxiosPromise<any>>;
export default async function getAuthToken(
	code: string,
	client_id: string,
	code_verifier: string,
	test?: boolean
): Promise<any> {
	const config: AxiosRequestConfig = {
		method: "POST",
		url: "https://api.twitter.com/2/oauth2/token",
		params: {
			code,
			grant_type: "authorization_code",
			client_id,
			redirect_uri: getRedirectUri(),
			code_verifier,
		},
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
	};

	if (test) return config;

	const response = axios(config);

	return response;
}
