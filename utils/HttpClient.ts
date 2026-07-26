// utils/httpClient.ts

interface FetchOptions extends RequestInit {
    params?: Record<string, string | number>;
    token?: string;         // Token opcional si se quiere pasar de forma manual
    skipToken?: boolean;    // Flag para omitir el uso del token en rutas públicas (ej. /login)
}

export async function httpClient(url: string, options: any = {}) {
    const {
        params,       // Para query params (?search=abc)
        pathParams,   // Para path params (/api/v1/users/:id -> { id: 123 })
        method = 'GET',
        body,
        skipAuth = false, // Por defecto incluye credenciales
        headers,
        ...restOptions
    } = options;

    let finalUrl = 'http://localhost:3000' + url;

    // 1. Reemplazar Path Params si existen (ej. /users/:id -> /users/123)
    if (pathParams) {
        Object.entries(pathParams).forEach(([key, value]) => {
            finalUrl = finalUrl.replace(`:${key}`, encodeURIComponent(String(value)));
        });
    }

    // 2. Añadir Query Parameters opcionales si existen
    if (params) {
        const queryParams = new URLSearchParams(
            Object.entries(params).map(([key, value]) => [key, String(value)])
        );
        finalUrl = `${finalUrl}?${queryParams.toString()}`;
    }

    // 3. Configuración base para fetch
    const defaultOptions: any = {
        method,
        // Si skipAuth es true (ej. en el login), omitimos credentials. Si es false (por defecto), 
        // el navegador adjunta automáticamente la cookie "sesion" gracias a 'include'.
        ...(skipAuth ? {} : { credentials: 'include' }),
        headers: {
            ...(body && typeof body === 'object' ? { 'Content-Type': 'application/json' } : {}),
            ...(headers || {}),
        },
        ...(body ? { body: typeof body === 'string' ? body : JSON.stringify(body) } : {}),
        ...restOptions,
    };

    try {
        const response = await fetch(finalUrl, defaultOptions);

        console.log("Response", response)

        // Si no es una ruta pública y el servidor bota un 401 o 403, redirigimos al login
        if (!skipAuth && (response.status === 401 || response.status === 403)) {
            if (typeof window !== 'undefined') {
                const currentPath = window.location.pathname;
                window.location.href = `/?redirect=${encodeURIComponent(currentPath)}`;
            }
            throw new Error('Sesión no autorizada o expirada');
        }

        return response;

    } catch (error) {
        throw error;
    }
}