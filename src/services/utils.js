export const promisify = (
  callbackFn,
  args,
  fulfillFn,
) => {
  return new Promise((resolve, reject) => {
    callbackFn(...args, callbackArgs => {
      const isFulfilled = fulfillFn(...callbackArgs)
      if (isFulfilled) {
        resolve(callbackArgs)
      } else {
        reject(callbackArgs)
      }
    })
  })
}
