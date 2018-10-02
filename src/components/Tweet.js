import React from 'react'
import { Container, Image } from 'semantic-ui-react'

import { getAvatarUrl, getDisplayTime } from '../utils/utils'

export default class TweetContainer extends React.Component {
  render() {
    const { tweet } = this.props
    const { user } = tweet
    const avatarUrl = getAvatarUrl(tweet.user.profile_image_url_https)
    const time = getDisplayTime(tweet.created_at)

    return (
      <Container>
        <Image
          src={avatarUrl}
          height={'100px'}
          width={'100px'}
        />
        <a href={`https://twitter.com/${user.screen_name}`}>{user.name}</a>
        <span>{time}</span>
        <p dangerouslySetInnerHTML={{ __html: tweet.text }}/>
        <p dangerouslySetInnerHTML={{ __html: tweet.source }}/>
      </Container>
    )
  }
}
