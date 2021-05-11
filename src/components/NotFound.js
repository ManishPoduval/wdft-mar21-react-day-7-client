import React, { Component } from 'react'
import data from '../animations/dude.json'
import LottieControl from './LottieControl'


class NotFound extends Component {
  render() {
    return (
      <div>
          <h2>Developers are lazy!!!</h2>
          <LottieControl animation={data} width={700} height={800} />
      </div>
    )
  }
}

export default NotFound