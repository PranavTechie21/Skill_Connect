// API configuration
// FIX: Changed default port from 5001 to 5000 to match the running backend server.
// In development, default to localhost:5000 so Vite proxy issues or missing env don't block requests
// API_BASE_URL: only use when explicitly provided via VITE_API_URL.
// In development prefer relative paths so Vite's dev-server proxy can forward requests.
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? "";

export const apiFetch = (url: string, options?: RequestInit) => {
	// Build URL: if absolute already provided, use it. Otherwise prefer relative path
	// so the dev server proxy handles it. If API_BASE_URL is explicitly set, use that.
	const fullUrl = url.startsWith("http")
		? url
		: API_BASE_URL
		? `${API_BASE_URL}${url}`
		: url; // relative

	// If a token is stored in localStorage, include it as Bearer token.
	let headers: Record<string, string> = {};
	try {
		const token = localStorage.getItem('skillconnect_token_v1');
		if (token) headers['Authorization'] = `Bearer ${token}`;
	} catch (e) {
		// ignore storage errors
	}

	return fetch(fullUrl, {
		...options,
		headers: { ...(options && (options as any).headers), ...headers },
		credentials: "include",
	});
};

// Add the missing apiRequest export
export async function apiRequest(method: string, url: string, body?: unknown): Promise<Response> {
	const fullUrl = url.startsWith("http")
		? url
		: API_BASE_URL
		? `${API_BASE_URL}${url}`
		: url;

	const res = await fetch(fullUrl, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    credentials: "include",
  });
  
  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch {}
    throw new Error(message);
  }
  
  return res;
}
