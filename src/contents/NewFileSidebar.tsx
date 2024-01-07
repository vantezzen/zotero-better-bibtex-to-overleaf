import cssText from "data-text:~base.css"
import type {
  PlasmoCSConfig,
  PlasmoGetInlineAnchor,
  PlasmoGetOverlayAnchor,
  PlasmoMountShadowHost,
  PlasmoRender
} from "plasmo"

import NewFileSidebarButton from "~components/NewFileSidebarButton"

export const config: PlasmoCSConfig = {
  matches: ["https://www.overleaf.com/project/*"],
  world: "MAIN"
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const NewFileSidebar = () => {
  return <NewFileSidebarButton />
}

export const getInlineAnchor: PlasmoGetInlineAnchor = async () => {
  return document.querySelector(".modal-new-file--list .list-unstyled")
}

export default NewFileSidebar
