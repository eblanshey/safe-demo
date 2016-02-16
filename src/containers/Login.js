import React, { Component } from 'react'
import { Input, ButtonToolbar, Button, Alert } from 'react-bootstrap'
import { connectToSafe, h } from 'safe-api';
import { findDOMNode } from 'react-dom'

export class Login extends Component {

  constructor(props) {
    super(props)

    this.state = {
      error: null
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.authData) {
      this.props.history.pushState(null, '/')
    }
  }

  componentDidMount() {
    if (this.props.auth.authData) {
      this.props.history.pushState(null, '/')
    }
  }

  onLogin() {
    this.setState({error: null})

    let l = validate.call(this)

    if (!l) {return}

    this.props.api.login(l.email, l.password)
  }

  onSignup() {
    this.setState({error: null})

    let l = validate.call(this)

    if (!l) {return}

    this.props.api.signup(l.email, l.password).then((data) => console.log('data', data))
  }

  render() {
    const {auth} = this.props;

    let error = auth.error || this.state.error ? (
      <Alert bsStyle="danger">
        {this.state.error || auth.error}
      </Alert>) : null;

    return (
      <form>
        {error}
        <Input type="text" label="Email" placeholder="Email" ref='email' />
        <Input type="password" label="Password" placeholder="Password" ref='password' />
        <ButtonToolbar>
          <Button bsStyle="primary" bsSize="large" onClick={this.onLogin.bind(this)}>Log In</Button>
          <Button bsSize="large" onClick={this.onSignup.bind(this)}>Sign Up</Button>
        </ButtonToolbar>
      </form>
    )
  }

}

function mapPropsToSafe() {
  return [
    h('auth', 'auth')
  ]
}

export default connectToSafe(mapPropsToSafe)(Login);

function validate() {
  const email = this.refs.email.getValue()
  const password = this.refs.password.getValue()

  if (!email || !password) {
    this.setState({error: 'You must provide an email and password.'})
    return false;
  } else if (!validateEmail(email)) {
    this.setState({error: 'Please enter a valid email.'})
    return false;
  }

  return {
    email,
    password
  }
}

/**
 * http://stackoverflow.com/a/46181/371699
 *
 * @param email
 * @returns {boolean}
 */
function validateEmail(email) {
  var re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  return re.test(email);
}

