import { Loader2 } from "lucide-react"
import React, { useEffect } from "react"

import updateBibtexFile from "~lib/overleaf/updateBibtexFile"

import { Button } from "./ui/button"

function SyncAreaContent() {
  const [url, setUrl] = React.useState("")
  const [isSyncing, setIsSyncing] = React.useState(false)
  useEffect(() => {
    const cmContent = document.querySelector(".cm-content") as HTMLDivElement
    if (!cmContent) return

    const updateUrl = () => {
      setTimeout(() => {
        const content = cmContent.innerText.split("\n")
        if (!content[0] || content[0].trim() !== "# BETTER BIBTEX") {
          setUrl("")
          return
        }

        const url = content[1].replace("# ", "")
        setUrl(url)
      }, 100)
    }
    updateUrl()

    const observer = new MutationObserver(updateUrl)
    observer.observe(cmContent, { childList: true })

    return () => {
      observer.disconnect()
    }
  }, [])
  useEffect(() => {
    const forceFetch = async (e: MessageEvent) => {
      if (!url) return

      if (
        e.data.type !== "better-bibtex" ||
        e.data.action !== "update-bibtex-file"
      )
        return

      await updateBibtexFile(url)
    }

    window.addEventListener("message", forceFetch)
    return () => {
      window.removeEventListener("message", forceFetch)
    }
  }, [url])

  if (!url) return null

  return (
    <div
      style={{
        all: "unset",
        width: "100%"
      }}>
      <div className="bg-blue-200 p-4 w-full">
        <h1 className="text-lg font-bold">Sync with Better Bibtex</h1>

        <p className="text-sm font-medium">
          This file is synced with a Better Bibtex collection in Zotero.
          <br />
          Make sure Zotero is open before updating. Changes made in Overleaf
          will be overwritten.
        </p>

        <Button
          variant="secondary"
          onClick={async () => {
            setIsSyncing(true)
            await updateBibtexFile(url)
            setIsSyncing(false)
          }}
          disabled={isSyncing}
          className="flex items-center gap-2 mt-4 !bg-zinc-800 !text-white"
          data-bibtex-sync-button>
          {isSyncing && (
            <Loader2 size={16} className="animate-spin" strokeWidth={2} />
          )}
          Sync now
        </Button>
      </div>
    </div>
  )
}

export default SyncAreaContent
