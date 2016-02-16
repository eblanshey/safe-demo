import React, { Component } from 'react'
import { Button, Glyphicon } from 'react-bootstrap'
import { connectToSafe, h } from 'safe-api'
import { generateUUID } from '../utils/uuid'

export class Like extends Component {

  constructor(props) {
    super(props)

    this.countLikes.bind(this)

    this.iLike = false
  }

  likeClick() {
    const likeid = generateUUID(),
      collectionItem = {likeid},
      myUserid = this.props.auth.userid,
      likeEntity = {
        appPoster: this.props.userid,
        appid: this.props.id
      }

    if (!myUserid) {
      return console.log('you need to be logged in first')
    }

    this.props.api.putEntity('likes', myUserid, likeid, likeEntity)
      .then((data) => this.props.api.putCollectionItem('appLikes-'+this.props.id, this.props.userid, myUserid, collectionItem))
  }

  countLikes() {
    let { likesCollection, likes } = this.props, count = 0

    if (!likesCollection || !likesCollection.data || !likes || Object.keys(likes).length === 0)
      return count

    likesCollection = likesCollection.data

    for (let userid in likesCollection) {
      let likeid = likesCollection[userid].likeid

      if (
        likes[likeid] &&
        likes[likeid].data &&
        likes[likeid].data.appPoster === this.props.userid &&
        likes[likeid].data.appid === this.props.id
      ) {
        if (this.props.auth.userid == userid) {
          this.iLike = true
        }
        count++
      }
    }

    return count
  }

  render() {
    const numberOfLikes = this.countLikes(),
      isLoggedIn = this.props.auth.userid

    return (
      <Button title={!isLoggedIn?'You must be logged in first':null} disabled={this.iLike||!isLoggedIn?true:false} bsStyle="primary" onClick={this.likeClick.bind(this)}>
        <Glyphicon style={{marginRight:5}} glyph="thumbs-up" />
        {numberOfLikes} {numberOfLikes===1?' like':' likes'}
        {this.iLike?', including me':''}
      </Button>
    )
  }

}

function mapPropsToSafe(props) {
  return [ // the "key" is the userid of the person who LIKES
    h([`appLikes-${props.id}`, props.userid], 'likesCollection', (item, key) => (
      [
        h(['likes', key, item.likeid], 'likes{}')
      ]
    ))
  ]
}

export default connectToSafe(mapPropsToSafe)(Like)