import { key, secret } from './key.json'
import { OAUTH_TOKEN, OAUTH_TOKEN_SECRET } from './constants'

import CodeBird from 'codebird'
import { setTokenNSecret, getTokenNSecret } from './auth-control'

let cb = new CodeBird()

cb.setConsumerKey(key, secret)
cb.setUseProxy(false)

export const setUpCBToken = tokenObj => {
  const token = tokenObj[OAUTH_TOKEN]
  const secret = tokenObj[OAUTH_TOKEN_SECRET]
  cb.setToken(token, secret)
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
          setUpCBToken(resp)
          return setTokenNSecret(resp)
            .then(() => {
              return cb.__call('oauth_authorize', {}, authUrl => {
                if (authUrl)
                  return resolve(authUrl)

                return reject({
                  error: 'Authorize url error.'
                })
              })
            })
        }
      })
  })
}

export const getAccessToken = pin => {
  return new Promise((resolve, reject) => {
    cb.__call('oauth_accessToken',
      { oauth_verifier: pin },
      (resp, rate, err) => {
        if (err)
          return reject({
            error: 'Request access token error.'
          })

        if (resp) {
          setUpCBToken(resp)
          setTokenNSecret(resp)
            .then(() => {
              return resolve({
                [OAUTH_TOKEN]: resp.oauth_token,
                [OAUTH_TOKEN_SECRET]: resp.oauth_token_secret,
                uid: resp.user_id
              })
            })
        }

        return reject({
          error: 'Request access token error.'
        })
      })
  })
}

export const getCurUserInfo = () => {
  return getTokenNSecret()
    .then(tokenObj => {
      setUpCBToken(tokenObj)
      return new Promise((resolve, reject) => {
        return cb.__call(
          'account_verifyCredentials',
          {},
          (resp, rate, err) => {
            if (err)
              return reject({ error: 'Request verify credentials error.' })

            if (resp)
              return resolve(resp)

            return reject({
              error: 'Request verify credentials error.'
            })
          })
      })
    })
}


export const getTimeLine = (options = {}) =>
  getTokenNSecret()
    .then(setUpCBToken)
    .then(() => {
      const {
        count,
        since_id,
        max_id,
        trim_user,
        exclude_replies,
        include_entities,
      } = options

      return new Promise((resolve, reject) => {
        cb.__call(
          "statuses_homeTimeline",
          options,
          (res, rate, err) => {
            if (err)
              return reject(err)

            if (res)
              return resolve(res)

            return reject(err)
          }
        )
      })
    })
