import ReactDOM from "react-dom/client";
import { onElementReady } from "./utils";
import type { ContentScriptContext } from "wxt/utils/content-script-context";
export default function renderIntoAnchor(
  anchor: string,
  element: React.ReactElement,
  ctx: ContentScriptContext,
  name: string,
  append: ContentScriptAppendMode = "last",
) {
  onElementReady(anchor, async () => {
    const ui = await createShadowRootUi(ctx, {
      name,
      position: "inline",
      anchor,
      append,
      onMount: (container) => {
        const app = document.createElement("div");
        container.append(app);

        const root = ReactDOM.createRoot(app);
        root.render(element);
        return root;
      },
      onRemove: (root) => {
        // Unmount the root when the UI is removed
        root?.unmount();
      },
    });

    ui.mount();
  });
}
