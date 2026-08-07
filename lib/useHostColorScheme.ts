import { useLayoutEffect, useState, type RefObject } from "react";

const NUMBERS = /[\d.]+/g;

/**
 * Overleaf ships light and dark themes for both the editor and the site chrome
 * and doesn't expose the active one in a stable way. Instead of guessing we
 * sample the background colour behind our shadow host and match it, so the
 * injected UI never sits as a bright block inside a dark editor.
 *
 * Returns whether the surroundings are dark; put `dark` on your root element.
 */
export default function useHostColorScheme(ref: RefObject<HTMLElement | null>) {
  const [isDark, setIsDark] = useState(false);

  // Layout effect so the first paint is already in the right theme.
  useLayoutEffect(() => {
    const detect = () => {
      const root = ref.current?.getRootNode();
      const host = root instanceof ShadowRoot ? root.host : ref.current;
      const luminance = backgroundLuminance(host);
      if (luminance !== null) setIsDark(luminance < 0.5);
    };

    // Theme switches can swap a stylesheet rather than a class, in which case
    // the new colours aren't applied yet when the mutation fires.
    let timeout: ReturnType<typeof setTimeout>;
    const schedule = () => {
      detect();
      clearTimeout(timeout);
      timeout = setTimeout(detect, 300);
    };
    schedule();

    const observer = new MutationObserver(schedule);
    const attributes = {
      attributes: true,
      attributeFilter: ["class", "style"],
    };
    observer.observe(document.documentElement, attributes);
    observer.observe(document.body, attributes);
    observer.observe(document.head, { childList: true });

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, [ref]);

  return isDark;
}

/** Perceived brightness (0–1) of the nearest opaque background, or null. */
function backgroundLuminance(element: Element | null | undefined) {
  for (let node = element; node; node = node.parentElement) {
    const parts = getComputedStyle(node).backgroundColor.match(NUMBERS);
    if (!parts) continue;

    const [r = 0, g = 0, b = 0, alpha = 1] = parts.map(Number);
    if (alpha < 0.5) continue;

    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  }

  return null;
}
