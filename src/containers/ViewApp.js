import React, { Component } from 'react'
import { Grid, Row, Col, Button, Panel } from 'react-bootstrap'
import { connectToSafe, h } from 'safe-api'
import Image from '../components/Image'
import Like from '../components/Like'

class ToDoList extends Component {
  render() {
    const props = this.props

    if (!props.auth.uid) {
      return <div>You must be logged in to view this list!</div>
    }

    if (!props.toDoList.data) {
      return <div>Loading to-do list...</div>
    }

    let toDos = [],
      data = props.toDoList.data

    for (let key in data) {
      toDos.push(<li>{data[key].title}</li>)
    }

    return (
      <ul>
        {toDos}
      </ul>
    )
  }
}

function mapPropsToSafe(props) {
  return [
    h(['toDoCollection', props.userid], 'toDoList'),
    h('auth', 'auth'),
  ]
}

export default connectToSafe(mapPropsToSafe)(ToDoList)

export class ViewApp extends Component {

  render() {
    const {app, appExtended} = this.props

    return (
      <div>
        <Panel header={app.data ?
          app.data.name :
          'Loading...'}
          >
          <p><Like auth={this.props.auth} name='apps' userid={this.props.params.userid} id={this.props.params.id} /></p>

          <p>
            {app.data && app.data.image ? <Image meta={app.data.image} /> : '\<no image provided>'}
          </p>

          <p>{app.data ? app.data.short_description : 'Loading...'}</p>

          <p>{appExtended.data ? appExtended.data.long_description : 'Loading...'}</p>
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