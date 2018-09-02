import CodeBird from 'codebird'
import { key, secret } from './key.json'

let cb = new CodeBird()

cb.setConsumerKey(key, secret)
cb.setUseProxy(false)

const setUpToken = () => {
  let token = JSON.parse(sessionStorage.getItem('twissieToken'))
  cb.setToken(token.token, token.secret)
}

export const getAuthorizeUrl = () => {
  return new Promise((resolve, reject) => {
    cb.__call(
      'oauth_requestToken',
      { oauth_callback: 'oob' },
      (resp, rate, err) => {
        if (err)
          return reject({
            error: 'Request token error.'
          })

        if (resp) {
          console.log(resp)
          cb.setToken(resp.oauth_token, resp.oauth_token_secret)
          cb.__call('oauth_authorize', {}, function (authUrl) {
            if (authUrl)
              return resolve(authUrl)

            return reject({
              error: 'Authorize url error.'
            })
          })
        }
      })

  })
}

export const getAccessToken = (pin) => {
  return new Promise((resolve, reject) => {
    cb.__call('oauth_accessToken',
      { oauth_verifier: pin },
      function (res, rate, err) {
        if (err)
          return reject({
            error: 'Request access token error.'
          })

        if (res) {
          cb.setToken(res.oauth_token, res.oauth_token_secret)

          let token = {
            token: res.oauth_token,
            secret: res.oauth_token_secret,
          }

          // chrome.storage.local.set({ 'twissieToken': token })
          // sessionStorage.setItem('twissieToken', JSON.stringify(token))

          return resolve({
            token: res.oauth_token,
            secret: res.oauth_token_secret,
            uid: res.user_id
          })
        }

        return reject({
          error: 'Request access token error.'
        })
      })
  })
}

export const getUserInfo = () => {
  return new Promise((resolve, reject) => {
    cb.__call('account_verifyCredentials',
      {},
      (res, rate, err) => {
        if (err)
          return reject({ error: 'Request verify credentials error.' })


        if (res)
          return resolve({
            fullName: res.name,
            userName: res.screen_name,
            avatar: res.profile_image_url_https
          })


        return reject({
          error: 'Request verify credentials error.'
        })
      })
  })
}


export const getTL = () => {
  setUpToken()
  return new Promise((resolve, reject) => {
    cb.__call("statuses_homeTimeline", {}, (res, rate, err) => {
      if (err)
        return reject(err)

      if (res)
        return resolve(res)

      return reject(err)
    }
    )
  })
}