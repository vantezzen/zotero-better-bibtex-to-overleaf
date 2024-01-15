import cssText from "data-text:~base.css"
import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"

import NewFileSidebarButton from "~components/NewFileSidebarButton"
import SyncAreaContent from "~components/SyncAreaContent"

export const config: PlasmoCSConfig = {
  matches: ["https://*.overleaf.com/project/*"]
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const NewFileSidebar = () => {
  return <SyncAreaContent />
}

export const getInlineAnchor: PlasmoGetInlineAnchor = async () => {
  return document.querySelector(".cm-editor .cm-announced")
}

export default NewFileSidebar
