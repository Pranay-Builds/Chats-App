const API_URL = "http://localhost:5000/api";

export async function apiFetch(path: string, options: RequestInit = {}) {
    console.log("➡️ API FETCH:", path);

    const res = await fetch(`${API_URL}${path}`, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
        ...options,
    });

    console.log("⬅️ API STATUS:", res.status);

    const text = await res.text();
    console.log("📦 RAW RESPONSE:", text);

    try {
        return JSON.parse(text);
    } catch {
        throw new Error("Response is not JSON");
    }
}
