import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isOverleaf() {
  return !!document
    .querySelector('meta[name="ol-ExposedSettings"]')
    ?.getAttribute("content");
}

export function onElementReady(
  selector: string,
  callback: (element: Element) => void,
) {
  const processElement = (element: Element) => {
    if (element.hasAttribute("__zt_processed")) return;

    callback(element);
    element.setAttribute("__zt_processed", "true");
  };

  const element = document.querySelector(selector);
  if (element) {
    processElement(element);
  }
  const observer = new MutationObserver(() => {
    const element = document.querySelector(selector);
    if (element) {
      processElement(element);
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}
