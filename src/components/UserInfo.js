import React from 'react'
import { Card, Icon, Image } from 'semantic-ui-react'

import { getAvatarUrl, getDisplayTime } from '../utils/utils'

class UserInfo extends React.Component {
  render() {
    const { data: userInfo } = this.props
    const { status } = userInfo || {}

    const avatarUrl = getAvatarUrl(userInfo.profile_image_url_https)
    const bgUrl = userInfo.profile_background_image_url_https
    const createdAt = getDisplayTime(userInfo.created_at || null)

    return (
      <div className={'user-info'}>
        <Card>
          <Image src={avatarUrl}/>

          <Card.Content>
            <Card.Header>
              <a href={`https://twitter.com/${userInfo.screen_name}`}>{userInfo.name}</a>
            </Card.Header>

            <Card.Meta>
              <span className='date'>{createdAt}</span>
            </Card.Meta>
            <Card.Description>{userInfo.description}</Card.Description>
          </Card.Content>

          <Card.Content extra>
            <Icon name='arrow alternate circle right outline'/>
            <a href={userInfo.url}>link</a>
          </Card.Content>
        </Card>
      </div>
    )
  }
}

export default UserInfo
