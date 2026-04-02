const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const ENV = {
    api_url: rawApiUrl.replace(/\/$/, ""),
};
