import { sendMessage } from "../messaging";

export default async function updateBibtexFile(url: string) {
  const bibtex = await sendMessage("fetchZoteroData", url);
  const editor = document.querySelector(`.cm-content`) as HTMLDivElement;
  editor!.textContent = `# BETTER BIBTEX\n# ${url}\n\n${bibtex}`;
}
