import { isOverleaf } from "@/lib/utils";
import "../globals.css";
import NewFileSidebarButton from "./component";
import renderIntoAnchor from "@/lib/render";

export default defineContentScript({
  matches: ["<all_urls>"],
  runAt: "document_idle",
  cssInjectionMode: "ui",

  async main(ctx) {
    if (!isOverleaf()) return;
    renderIntoAnchor(
      ".modal-new-file-list .list-unstyled",
      <NewFileSidebarButton />,
      ctx,
      "new-file-sidebar-button",
    );
  },
});
