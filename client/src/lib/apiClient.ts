const API_URL = "http://localhost:5000/api"


export async function apiFetch(path: string, options: RequestInit = {}) {
    console.log("➡️ API FETCH:", path);

    const isFormData = options.body instanceof FormData;

    const res = await fetch(`${API_URL}${path}`, {
        credentials: "include",
        headers: {
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
            ...options.headers,
        },
        ...options,
    });

    console.log("⬅️ API STATUS:", res.status);

    const text = await res.text();
    console.log("📦 RAW RESPONSE:", text);

    try {
        const parsed = JSON.parse(text);
        return {
            ok: res.ok,
            status: res.status,
            data: parsed
        };
    } catch {
        throw new Error("Response is not JSON");
    }
}
