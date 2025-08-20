// Simple key/value persistence using browser localStorage

export const saveData = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Error saving data to localStorage", e);
  }
};

export const getData = <T = unknown>(key: string): T | null => {
  try {
    const json = localStorage.getItem(key);
    return json ? (JSON.parse(json) as T) : null;
  } catch (e) {
    console.error("Error reading data from localStorage", e);
    return null;
  }
};
