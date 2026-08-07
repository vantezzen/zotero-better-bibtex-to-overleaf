import { defineConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react", "@wxt-dev/auto-icons"],

  vite: () => ({
    plugins: [tailwindcss()],
  }),
  manifest: {
    host_permissions: ["<all_urls>"],
    name: "Zotero Better-BibTex to Overleaf",
  },
});
