export type ApiClientConfig = {
  /** e.g. http://localhost:4000/api/v1 */
  baseUrl: string;
  /** When true, requests are answered by the in-memory mock server (no backend needed). */
  useMocks: boolean;
  /** Returns the current bearer token, if signed in. */
  getToken: () => string | null;
  /** Called when the API answers 401 so the app can sign the user out. */
  onUnauthorized?: () => void;
};

let config: ApiClientConfig = { baseUrl: "http://localhost:4000/api/v1", useMocks: true, getToken: () => null };

export const configureApiClient = (next: Partial<ApiClientConfig>) => {
  config = { ...config, ...next };
};
export const getApiConfig = () => config;
