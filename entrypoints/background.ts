import { onMessage } from "@/lib/messaging";

export default defineBackground(() => {
  onMessage("fetchZoteroData", async (msg) => {
    // Errors are propagated to the caller so the UI can show them, rather than
    // ending up as the contents of the bibliography file.
    const response = await fetch(msg.data, {
      headers: {
        "Zotero-Allowed-Request": "Hello",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Zotero replied with ${response.status} ${response.statusText}`,
      );
    }

    return response.text();
  });
});
