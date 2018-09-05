import { EXTENSION_ID } from "./constants"

const codePrefix = `${EXTENSION_ID}_CODE`

export const getAuthCode = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([`${codePrefix}`], res => {
      const notEmpty = Object.values(res).length > 0
      if (notEmpty) {
        resolve(res[codePrefix])
      } else {
        reject(null)
      }
    })
  })
}

export const saveAuthCode = code => {
  return new Promise((resolve) => {
    chrome.storage.local.set({ codePrefix: code }, () => {
      resolve({ success: true })
    })
  })
}
