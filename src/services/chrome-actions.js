export const openTab = url => {
    return new Promise((resolve, reject) => {
        chrome.tabs.create({ url }, tab => {
            return resolve(tab)
        })
        // try {
        // } catch (err) {
        //     reject(err)
        // }
    })
}