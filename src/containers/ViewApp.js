import React, { Component } from 'react'
import { Grid, Row, Col, Button, Panel } from 'react-bootstrap'
import { connectToSafe, h } from 'safe-api'
import Image from '../components/Image'
import Like from '../components/Like'
import config from '../config'

export class ViewApp extends Component {

  constructor(props) {
    super(props)

    this.deleteApp = this.deleteApp.bind(this)

    this.state = {
      deleting: false
    }
  }

  componentWillReceiveProps(props) {
    // If the entity does not exist, then redirect to the home page
    if (props.app.data === null) {
      this.props.history.pushState(null, '/')
    }
  }

  deleteApp() {
    if (!confirm('Are you sure you want to permanently delete this app?')) {
      return
    }

    const appId = this.props.params.id,
      appUserId = this.props.params.userid,
      { api } = this.props

    this.setState({deleting: true})

    // The owner can delete the collection item followed by everything else
    if (this.isAppOwner()) {
      // There's a lot to delete! Start with the admin's collection, so that if the request is interrupted,
      // the admin won't be linking to a half broken entity, due to it being partly deleted.
      api.deleteCollectionItem('apps', config.admin, appId)
        .then(() => {
          Promise.all([
            // Maybe the app owner liked his own app. Delete his like.
            this.refs.like.getRef().deleteLikeByUserId(appUserId),
            // Remove the likes collection. We can't remove the entities since they don't belong to us.
            api.deleteEntireCollection('appLikes-'+appId, appUserId),
            // Remove apps_extended
            api.deleteEntity('apps_extended', appUserId, appId),
            // Remove the image (if available)
            this.props.app.data.image ? api.deleteEntity('images', appUserId, this.props.app.data.image[2]) : null,
            // Remove the actual app
            api.deleteEntity('apps', appUserId, appId)
            // Then go back home!
          ]).then(() => this.props.history.pushState(null, '/'))
        }).catch(error => {
          console.log('Got an error', error)
          this.setState({deleting: false})
        })
    } else if (this.isAdmin()) {
      // The admin can only delete the collection item and his own like
      api.deleteCollectionItem('apps', config.admin, appId)
        .then(() => this.refs.like.getRef().deleteLikeByUserId(config.admin))
        .then(() => this.props.history.pushState(null, '/'))
        .catch(error => {
          console.log('Got an error', error)
          this.setState({deleting: false})
        })
    } else {
      this.setState({deleting: false})
    }

  }

  isAppOwner() {
    return this.props.auth.userid === this.props.params.userid
  }

  isAdmin() {
    return this.props.auth.userid === config.admin
  }

  render() {
    const {app, appExtended, auth} = this.props,
      appUserId = this.props.params.userid,
      appId = this.props.params.id

    const button = this.isAdmin() || this.isAppOwner() ?
      <Button disabled={this.state.deleting} onClick={this.deleteApp} bsStyle="danger">Delete App</Button> :
      null

    return (
      <div>
        <Panel header={app.data ?
          app.data.name :
          'Loading...'}
          >
          <p><Like ref="like" auth={auth} name='apps' userid={appUserId} id={appId} /></p>

          <p>
            {app.data && app.data.image ? <Image meta={app.data.image} /> : '\<no image provided>'}
          </p>

          <p>{app.data ? app.data.short_description : 'Loading...'}</p>

          <p>{appExtended.data ? appExtended.data.long_description : 'Loading...'}</p>

          <p>{button}</p>
        </Panel>
      </div>
    );
  }

}

function mapPropsToSafe(props) {
  return [
    h('auth', 'auth'),
    h(['apps', props.params.userid, props.params.id], 'app'),
    h(['apps_extended', props.params.userid, props.params.id], 'appExtended')
  ]
}

export default connectToSafe(mapPropsToSafe)(ViewApp)