export const fetchData = async<T>(url: string, signal?: AbortSignal): Promise<T> => {
    const res = await fetch(url, { signal });
    if (!res.ok) throw new Error(`Request failed (${res.status}): ${url}`);
    const d = await res.json();
    return d as T;
};
