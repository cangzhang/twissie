import React from 'react'

const $ = document.querySelector.bind(document)

class InfiniteScroll extends React.Component {
  componentDidMount() {
    window.addEventListener('scroll', this.fireScroll, true)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.fireScroll)
  }

  fireScroll = () => {
    const { selector } = this.props
    const totalHeight = window.innerHeight
    const { top, height } = $(selector).getBoundingClientRect()
    const shouldLoad = Math.abs(top) + totalHeight >= height - 200
    console.log(shouldLoad)
  }

  render() {
    return (
      this.props.children
    )
  }
}

export default InfiniteScroll
