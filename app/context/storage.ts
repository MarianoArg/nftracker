import type { State } from "./types";

export function setAddressData(key: string, data: Partial<State>) {
  try {
    if (key && data) {
      window.localStorage.setItem(key, JSON.stringify(data));
    }
  } catch (e) {
    // saving error
    console.error(e);
  }
}

export function clearAddressData(key: string) {
  try {
    window.localStorage.removeItem(key);
  } catch (e) {
    // remove error
    console.error(e);
  }
  return;
}

export function getAddressData(key?: string): State | null {
  try {
    if (key) {
      const data = window.localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    }
    return null;
  } catch (e) {
    // error reading value
    console.error(e);
    return null;
  }
}
