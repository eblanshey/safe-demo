import React, { Component } from 'react'
import { Link } from 'react-router'
import * as Bootstrap from 'react-bootstrap'
import { connectToSafe, h } from 'safe-api'

export class Image extends Component {

  render() {
    const { image } = this.props,
      style = {
        maxHeight: 175,
        maxWidth: 175
      }

    return image.data ? <Bootstrap.Image style={style} src={image.data.data} thumbnail /> : null
  }

}

function mapPropsToSafe(props) {
  return [
    h(props.meta, 'image')
  ]
}

export default connectToSafe(mapPropsToSafe)(Image)