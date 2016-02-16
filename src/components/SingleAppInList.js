import React, { Component } from 'react'
import { Link } from 'react-router'
import { Col, Panel } from 'react-bootstrap'
import { connectToSafe, h } from 'safe-api'

import Image from './Image'

export class SingleAppInList extends Component {

  render() {
    const { app, id, appMeta } = this.props

    return (
      <Col xs={12} md={4}>
        <Panel header={app.data ?
          <Link style={{textDecoration: 'underline'}} to={`/app/${appMeta.userid}/${id}`}>{app.data.name}</Link> :
          'Loading...'}
        >
          <p style={{textAlign: 'center'}}>
            {app.data && app.data.image ? <Image meta={app.data.image} /> : null}
          </p>
          {app.data ? app.data.short_description : 'Loading...'}
        </Panel>
      </Col>
    )
  }

}

function mapPropsToSafe(props) {
  return [
    h(['apps', props.appMeta.userid, props.id], 'app')
  ]
}

export default connectToSafe(mapPropsToSafe)(SingleAppInList)