import React, { useEffect } from "react"

import createBibtexFile from "~lib/overleaf/createBibtexFile"

import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

function NewBibtexFileModalContent() {
  const [url, setUrl] = React.useState("")
  const [style, setStyle] = React.useState<HTMLStyleElement | null>(null)

  useEffect(() => {
    const style = document.createElement("style")
    style.textContent = `
      .modal-footer {
        display: none;
      }
    `
    document.head.appendChild(style)
    setStyle(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <div>
      <h2 className="text-lg font-bold">New Better Bibtex Import</h2>

      <p className="text-sm">
        To import a Better Bibtex file locally, enter the URL to fetch the
        content:
      </p>

      <ol className="list-decimal list-inside">
        <li>
          Make sure you have the Better Bibtex extension installed in Zotero
        </li>
        <li>Right-click on your collection in the left sidebar</li>
        <li>
          Under "Better BibTeX", choose "Download Better BibTeX export..."
        </li>
        <li>
          Choose "BibLaTeX" or "BibTeX" as the format depending on your
          preference
        </li>
        <li>Copy the URL to the field below</li>
        <li>
          <b>Close</b> the BibTeX export window in Zotero. If you don't, the
          file will be locked and you won't be able to import it.
        </li>
      </ol>
      <form
        id="create-file"
        onSubmit={async () => {
          style?.remove()
          await createBibtexFile(url)
        }}>
        <Label htmlFor="url">URL</Label>
        <Input
          placeholder="http://127.0.0.1:23119/better-bibtex/export/collection?/1/123456.biblatex"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value)
          }}
          name="url"
          id="url"
        />

        <Button
          type="submit"
          className="mt-2 !bg-zinc-900 !text-white !rounded-lg"
          disabled={!url}>
          Create
        </Button>
      </form>
    </div>
  )
}

export default NewBibtexFileModalContent
