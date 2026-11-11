import Constants from 'expo-constants';

const FALLBACK_PORT = 5000;
const FALLBACK_LAN_URL = `http://192.168.1.1:${FALLBACK_PORT}`;

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

  // Auto-detect IP from Expo bundler host when running on physical device or emulator
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const hostIp = hostUri.split(':')[0];
    if (hostIp) {
      return `http://${hostIp}:${FALLBACK_PORT}`;
    }
  }

  return FALLBACK_LAN_URL;
};

export const API_BASE_URL = getApiBaseUrl();

