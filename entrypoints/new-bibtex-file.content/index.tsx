import { isOverleaf } from "@/lib/utils";
import "../globals.css";
import NewBibtexFileModalContent from "./component";
import renderIntoAnchor from "@/lib/render";

export default defineContentScript({
  matches: ["<all_urls>"],
  runAt: "document_idle",
  cssInjectionMode: "ui",
  async main(ctx) {
    if (!isOverleaf()) return;
    renderIntoAnchor(
      ".better-bibtex-new-file",
      <NewBibtexFileModalContent />,
      ctx,
      "new-bibtex-file-modal-content",
    );
  },
});
