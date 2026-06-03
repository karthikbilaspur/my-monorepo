import { useState } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
) {
  const [value, setValue] = useState<T>(() => {
    const item =
      localStorage.getItem(key);

    return item
      ? JSON.parse(item)
      : initialValue;
  });

  const updateValue = (
    newValue: T
  ) => {
    setValue(newValue);

    localStorage.setItem(
      key,
      JSON.stringify(newValue)
    );
  };

  return [value, updateValue] as const;
}