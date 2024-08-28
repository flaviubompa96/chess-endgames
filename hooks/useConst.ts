import { useRef } from "react";

export const useConst = <T>(initialValue: T | (() => T)): T => {
    const ref = useRef<{ value: T }>();
    if (ref.current === undefined) {
      ref.current = {
        value:
          typeof initialValue === "function"
            ? // eslint-disable-next-line @typescript-eslint/ban-types
              (initialValue as Function)()
            : initialValue,
      };
    }
    return ref.current.value;
  }
  