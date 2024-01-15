import cssText from "data-text:~base.css"
import type {
  PlasmoCSConfig,
  PlasmoGetInlineAnchor,
  PlasmoGetOverlayAnchor
} from "plasmo"

import NewBibtexFileModalContent from "~components/NewBibtexFileModalContent"

export const config: PlasmoCSConfig = {
  matches: ["https://*.overleaf.com/project/*"],
  world: "MAIN"
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const NewBibtexFile = () => {
  return <NewBibtexFileModalContent />
}

export const getInlineAnchor: PlasmoGetInlineAnchor = async () => {
  return document.querySelector(".better-bibtex-new-file")
}

export default NewBibtexFile
