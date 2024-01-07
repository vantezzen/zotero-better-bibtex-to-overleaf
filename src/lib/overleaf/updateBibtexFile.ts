import { sendToBackground } from "@plasmohq/messaging"

export default async function updateBibtexFile(url: string) {
  const bibtex = await sendToBackground({
    name: "fetch",
    body: {
      url
    }
  })
  const editor = document.querySelector(`.cm-content`) as HTMLDivElement
  editor!.textContent = `# BETTER BIBTEX\n# ${url}\n\n${bibtex.message}`
}
