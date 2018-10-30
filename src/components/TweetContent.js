import _get from 'lodash/get'
import React from 'react'

const getAllIndices = _data => {
  const arr = ['hashtags', 'symbols', 'urls', 'user_mentions']
  const gaps = {}
  for (let prop of arr) {
    const data = _get(_data, prop, [])
    if (data.length) {
      for (let item of data) {
        if (Array.isArray(item.indices)) {
          const { indices } = item
          const [start] = indices
          gaps[start] = {
            ...item,
            type: prop,
          }
        }
      }
    }
  }
  return gaps
}

const composeContent = (gaps, text) => {
  const arr = []
  const sts = Object.keys(gaps)

  arr.push(text.slice(0, sts[0]))

  for (let i = 1; i < sts.length; i++) {
    arr.push(gaps[i])
    const [, end] = gaps[i].indices
    arr.push(text.slice(end, sts[i + 1]))
  }

  return arr
}

export default class TweetContent extends React.Component {
  componentDidMount() {
    const { tweet } = this.props
    if (!tweet.text)
      return

    const { text } = tweet
    const indiceObj = getAllIndices(tweet)

    const arr = composeContent(indiceObj, text)
    console.log(arr)
  }

  render() {
    return (
      <div>Tweet Content</div>
    )
  }
}