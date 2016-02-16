import React, { Component } from 'react'
import { Link } from 'react-router'
import { Button, Input, Alert } from 'react-bootstrap'
import { connectToSafe, h } from 'safe-api'
import config from '../config'
import { generateUUID } from '../utils/uuid'

export class Submit extends Component {

  constructor(props) {
    super(props)

    this.doSubmit = this.doSubmit.bind(this)

    this.state = {
      error: null
    }

    this.statuses = ['development', 'live', 'rejected', 'abandoned']
  }

  componentDidMount() {
    if (!this.props.auth.authData) {
      this.props.history.replaceState(null, '/login')
    }
  }

  onSubmit() {
    this.setState({error: null})

    const
      refs = this.refs,
      {api, auth} = this.props,
      app = {
        name: refs.name.getValue(),
        short_description: refs.short_description.getValue(),
        status: this.statuses[Math.floor(Math.random() * this.statuses.length)] // random element
      },
      appExtended = {
        long_description: refs.long_description.getValue()
      }

    // Validation
    if (!app.name || !app.short_description || !appExtended.long_description) {
      return this.setState({error: 'You must supply all fields'})
    }

    const files = refs.image.getInputDOMNode().files

    if (files.length === 1) {
      var reader = new FileReader()
      reader.onload = (e) => this.doSubmit(app, appExtended, e.target.result)
      reader.readAsDataURL(files[0]);
    } else {
      this.doSubmit(app, appExtended)
    }
  }

  doSubmit(app, appExtended, imageCode) {
    // Submit!
    const
      id = generateUUID(),
      userid = this.props.auth.authData.uid,
      collectionItem = {
        userid: userid
      },
      {api} = this.props

    const image = imageCode ?
      {
        data: imageCode
      } : null

    if (image) {
      const imageId = generateUUID()
      app.image = ['images', userid, imageId]

      api.putEntity('images', userid, imageId, image)
        .then(() => api.putEntity('apps', userid, id, app))
        .then(() => api.putEntity('apps_extended', userid, id, appExtended))
        .then(() => api.putCollectionItem('apps', config.admin, id, collectionItem))
        .then(() => this.props.history.pushState(null, `/app/${userid}/${id}`))
    } else {
      api.putEntity('apps', userid, id, app)
        .then(() => api.putEntity('apps_extended', userid, id, appExtended))
        .then(() => api.putCollectionItem('apps', config.admin, id, collectionItem))
        .then(() => this.props.history.pushState(null, `/app/${userid}/${id}`))
    }
  }

  render() {
    const {auth} = this.props

    let error = auth.error || this.state.error ? (
      <Alert bsStyle="danger">
        {this.state.error || auth.error}
      </Alert>) : null;

    return (
      <form>
        {error}
        <Input type="text" label="App Name" placeholder="App Name" ref='name' />
        <Input type="text" label="Short Description" placeholder="Short Description" ref='short_description' />
        <Input type="textarea" label="Long Description" placeholder="Long Description" ref='long_description' />
        <Input type="file" label="Image" ref='image' accept="image/*" />
        <Button bsStyle="primary" bsSize="large" onClick={this.onSubmit.bind(this)}>Submit App</Button>
      </form>
    );
  }

}

function mapPropsToSafe(props) {
  return [
    h('auth', 'auth')
  ]
}

export default connectToSafe(mapPropsToSafe)(Submit)