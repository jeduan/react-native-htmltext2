import {parseFragment} from 'parse5'
import React, {View} from 'react-native'
import processNode from './process-node'

export default class HtmlText extends React.Component {
  componentDidMount () {
    this.fragment = this.parse(this.props.html)
    this.rootKey = 'ht_'
  }

  parse (html) {
    return parseFragment(html)
  }

  render () {
    var children = this.fragment.childNodes.map(
      (node, index) => processNode(node, `${this.rootKey}_${index}`)
    )

    return (
      <View style={this.props.style}>
        {children}
      </View>
    )
  }
}

