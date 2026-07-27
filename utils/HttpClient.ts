// utils/httpClient.ts

interface FetchOptions extends RequestInit {
    params?: Record<string, string | number | boolean>;
    pathParams?: Record<string, string | number>;
    skipAuth?: boolean;
    headers?: Record<string, string>;
}

export async function httpClient(url: string, options: FetchOptions = {}) {
    const {
        params,
        pathParams,
        method = 'GET',
        body,
        skipAuth = false,
        headers,
        ...restOptions
    } = options;

    let finalUrl = 'http://3001' + url;

    // 1. Reemplazar Path Params (:id)
    if (pathParams) {
        Object.entries(pathParams).forEach(([key, value]) => {
            finalUrl = finalUrl.replace(`:${key}`, encodeURIComponent(String(value)));
        });
    }

    // 2. Añadir Query Parameters
    if (params) {
        const queryParams = new URLSearchParams(
            Object.entries(params).map(([key, value]) => [key, String(value)])
        );
        finalUrl = `${finalUrl}?${queryParams.toString()}`;
    }

    // 3. Configuración base para fetch
    const defaultOptions: RequestInit = {
        method,
        credentials: 'include',
        headers: {
            ...(body && typeof body === 'object' ? { 'Content-Type': 'application/json' } : {}),
            ...(headers || {}),
        },
        ...(body ? { body: typeof body === 'string' ? body : JSON.stringify(body) } : {}),
        ...restOptions,
    };

    try {
        const response = await fetch(finalUrl, defaultOptions);

        // Si la sesión expiró o no es válida
        if (!skipAuth && (response.status === 401 || response.status === 403)) {
            if (typeof window !== 'undefined') {
                const currentPath = window.location.pathname;
                // window.location.href = `/?redirect=${encodeURIComponent(currentPath)}`;
            }
        }

        return response;

    } catch (error) {
        console.error("Error en httpClient fetch:", error);
        throw error; // Re-lanzar para que el .catch() de tu componente pueda gestionarlo
    }
}