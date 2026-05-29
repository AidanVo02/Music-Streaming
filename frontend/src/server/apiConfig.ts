const FALLBACK_PORT = 5000;
const FALLBACK_LAN_URL = `http://192.168.1.100:${FALLBACK_PORT}`;

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

export const getApiBaseUrl = (): string => {
  const configuredUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (configuredUrl) {
    return trimTrailingSlash(configuredUrl);
  }

  if (typeof window !== 'undefined' && window.location?.hostname) {
    const { hostname, protocol } = window.location;
    const safeProtocol = protocol === 'https:' ? 'https:' : 'http:';
    return `${safeProtocol}//${hostname}:${FALLBACK_PORT}`;
  }

  return FALLBACK_LAN_URL;
};

export const API_BASE_URL = getApiBaseUrl();
