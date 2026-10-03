export const setLocalStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event(`local-storage:${key}`));
};

export const removeLocalStorage = (key: string) => {
  localStorage.removeItem(key);
  window.dispatchEvent(new Event(`local-storage:${key}`));
};
