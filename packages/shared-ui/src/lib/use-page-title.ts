import { useEffect } from "react";

/** Sets the browser tab title for SPA pages. */
export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
