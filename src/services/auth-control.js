import { EXTENSION_ID, OAUTH_TOKEN, OAUTH_TOKEN_SECRET } from './constants'

const codePrefix = `${EXTENSION_ID}_AUTH_CODE`

export const getAuthCode = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(codePrefix, res => {
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
    chrome.storage.local.set({ [codePrefix]: code }, () => {
      resolve({ success: true })
    })
  })
}

export const getTokenNSecret = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([OAUTH_TOKEN, OAUTH_TOKEN_SECRET], res => {
      const hasVal = Object.values(res).length === 2

      if (hasVal) {
        resolve(res)
      } else {
        reject({
          error: 'Token & secret not found.'
        })
      }
    })
  })
}

export const setTokenNSecret = (obj = {}) => {
  return new Promise((resolve, reject) => {
    const isValid = obj[OAUTH_TOKEN] && obj[OAUTH_TOKEN_SECRET]
    if (!isValid) {
      return reject({
        error: `Invalid token/secret.`
      })
    }

    chrome.storage.local.set({
      [OAUTH_TOKEN]: obj[OAUTH_TOKEN],
      [OAUTH_TOKEN_SECRET]: obj[OAUTH_TOKEN_SECRET]
    }, () => {
      resolve(obj)
    })
  })
}
