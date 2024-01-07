import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const message = await fetch(req.body.url, {
    headers: {
      "Zotero-Allowed-Request": "Hello"
    }
  })
    .then((response) => response.text())
    .catch((error) => {
      console.error(error)
      return error
    })

  res.send({
    message
  })
}

export default handler
