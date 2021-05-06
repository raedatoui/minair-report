export const fetchData = async<T>(url:string): Promise<T> => {
    const res = await fetch(url);
    const d = await res.json();
    return d as T;
};
