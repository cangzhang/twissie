export const openNewTab = url => {
  return new Promise((resolve, reject) => {
    chrome.tabs.create({ url }, tab => {
      if (tab) {
        resolve(tab)
      } else {
        reject(null)
      }
    })
  })
}
