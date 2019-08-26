import React, { Component } from 'react'
import styled from 'styled-components'

const H2 = styled.h2`
  color: blue;
  max-width: 100vw;
`

class Child extends Component {
  constructor(props) {
    super(props)

    this.state = { count: 0 }
  }

  componentDidMount() {
    setInterval(() => {
      this.setState({
        count: this.state.count + 1,
      })
    }, 1000)
  }

  render() {
    return <H2>{this.state.count}</H2>
  }
}

export default Child
