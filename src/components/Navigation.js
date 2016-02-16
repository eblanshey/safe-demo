import React, { Component } from 'react'
import { Navbar, Nav, NavItem } from 'react-bootstrap'
import { connectToSafe, h } from 'safe-api';
import { Link } from 'react-router'

export class Navigation extends Component {

  render() {
    const {authData} = this.props.auth;

      var body = authData ?
        <Navbar.Text>Welcome, {authData.uid}!</Navbar.Text> :
        <Navbar.Text><Link to='/login' style={{color:'#9d9d9d'}}>Login/Signup</Link></Navbar.Text>

    // Navbar code taken straight out of react-bootstrap docs
    return (
      <Navbar inverse>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#">SAFE Apps</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            <NavItem href="https://github.com/eblanshey/safe-demo" target="_blank">GitHub</NavItem>
            {body}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }

}

function mapPropsToSafe() {
  return [
    h('auth', 'auth')
  ]
}

export default connectToSafe(mapPropsToSafe)(Navigation);
