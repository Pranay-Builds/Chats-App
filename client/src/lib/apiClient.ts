const API_URL = "http://localhost:5000/api";

export async function apiFetch(
    path: string,
    options: RequestInit = {}
) {
    const res = await fetch(`${API_URL}${path}`, {
        credentials: "include", 
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
        ...options,
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const error = new Error(errorData.error || "API request failed");
        throw error;
    }


    return res.json();
}