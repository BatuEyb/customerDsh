// src/api.js
export const BASE_URL = "http://localhost/customerDsh/src/api";

// Sadece endpoint adını ver, URL’i otomatik tamamlasın
export function apiFetch(endpoint, options = {}) {
  return fetch(`${BASE_URL}/${endpoint}`, options);
}