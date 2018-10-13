const EXTENSION_ID = chrome.runtime.id
const code = document.querySelector('#oauth_pin > p > kbd > code').innerText
chrome.runtime.sendMessage(EXTENSION_ID, { [EXTENSION_ID]: code })

