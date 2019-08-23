import React, { Component } from 'react'
import H1 from './Home.css'
import Child from './Child'

class Home extends Component {
  render() {
    return (
      <>
        <H1>Home</H1>
        <Child />
      </>
    )
  }
}

export default Home
