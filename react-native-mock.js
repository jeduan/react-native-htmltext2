import React from 'react'
export {Component, PropTypes} from 'react'

export const StyleSheet = {
  create: (style) => style
}

const createComponent = (type) => {
  return React.createClass({
    displayName: type,
    propTypes: {
      children: React.PropTypes.node
    },
    render () {
      return <div {...this.props}>{this.props.children}</div>
    }
  })
}

export const View = createComponent('View')
export const Text = createComponent('Text')
export default React

