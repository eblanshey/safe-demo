import '../css/bootstrap.css'
import '../css/bootstrap-theme.css'

import React, { Component, PropTypes } from 'react';
import { Grid, Row, Col } from 'react-bootstrap'

import Navigation from '../components/Navigation'

export default class App extends Component {

  render() {
    return (
      <div>
        <Navigation />
        <Grid>
          <Row className="show-grid">
            <Col xs={12} md={8}>{this.props.children}</Col>
          </Row>
        </Grid>
      </div>
    )
  }

}
