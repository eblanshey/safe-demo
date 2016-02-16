import React, { Component } from 'react'
import { Link } from 'react-router'
import { Jumbotron, Grid, Row, Col, Button, Panel } from 'react-bootstrap'
import { connectToSafe, h } from 'safe-api'
import SingleApp from '../components/SingleAppInList'
import config from '../config'

export class AppList extends Component {

  render() {
    let apps = [], appList = this.props.appList.data

    if (appList) {
      for (let id of Object.keys(appList)) {
        apps.push(<SingleApp key={id} id={id} appMeta={appList[id]} />)
      }
    }

    return (
      <div>
        <Jumbotron>
          <h2>Welcome to the SAFE demo app!</h2>

          <p>
            This is a simple "SAFE Apps Directory" application demonstrating how to use the safe api
            ReactJS helpers. Expect any and all data to be wiped clean every now and then.
            Since it's just a demo, feel free to submit anything you want since as there is no moderation.
          </p>
        </Jumbotron>

        <div className="clearfix"><p><Link to='/submit' className='btn btn-info btn-lg'>Submit New App</Link></p></div>

        <Row className="show-grid">
          {apps}
        </Row>
      </div>
    );
  }

}

function mapPropsToSafe(props) {
  return [
    h(['apps', config.admin], 'appList')
  ]
}

export default connectToSafe(mapPropsToSafe)(AppList)