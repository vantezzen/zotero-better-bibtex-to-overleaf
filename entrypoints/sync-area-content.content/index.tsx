import { isOverleaf } from "@/lib/utils";
import "../globals.css";
import renderIntoAnchor from "@/lib/render";
import SyncAreaContent from "./component";

export default defineContentScript({
  matches: ["<all_urls>"],
  runAt: "document_idle",
  cssInjectionMode: "ui",

  async main(ctx) {
    if (!isOverleaf()) return;
    renderIntoAnchor(
      ".cm-editor",
      <SyncAreaContent />,
      ctx,
      "sync-area-content",
      "first",
    );
  },
});
