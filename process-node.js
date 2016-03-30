import DEFAULT_STYLES from './default-styles'
import React, {View, Text} from 'react-native'

var BLOCK_ELEMENTS = ['blockquote', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'ol', 'p', 'pre', 'ul', 'li']

var INLINE_ELEMENTS = ['b', 'i', 'em', 'strong', 'a', 'br', 'q', 'span', 'sub', 'sup']

function styleForTag (tagName) {
  var style = DEFAULT_STYLES[tagName] ? DEFAULT_STYLES[tagName] : DEFAULT_STYLES['default']
  return style
}

function isText (tagName) : Boolean {
  return tagName === '#text'
}

function isBlockElement (tagName) : Boolean {
  return BLOCK_ELEMENTS.includes(tagName)
}

function isInlineElement (tagName) : Boolean {
  return INLINE_ELEMENTS.includes(tagName)
}

export default function processNode (node, parentKey) {
  if (isText(node.nodeName)) {
    return processTextNode(node, parentKey)
  }

  if (isInlineElement(node.nodeName)) {
    return processInlineNode(node, parentKey)
  }

  if (isBlockElement(node.nodeName)) {
    return processBlockNode(node, parentKey)
  }

  console.warn(`unsupported node: ${node.nodeName}`)
  return null
}

function processTextNode (node, parentKey) {
  let key = `${parentKey}_text`
  return <Text key={key}>{node.value}</Text>
}

function processInlineNode (node, parentKey) {
  let key = `${parentKey}_${node.nodeName}`
  var unsupportedElements : Array = node.childNodes.filter(
    (node) => !(isInlineElement(node.nodeName) && isText(node.nodeName))
  )
  if (unsupportedElements.length) {
    unsupportedElements.forEach(
      (child) => {
        console.error(`Inline element ${node.nodeName} can only have inline children, ${child} is invalid!`)
      }
    )
  }

  var children = node.childNodes.filter(
    (node) => isInlineElement(node.nodeName) && isText(node.nodeName)
  ).map(
    (node, index) => processNode(node, `${key}_${index}`)
  )
  return <Text key={key} style={styleForTag(node.nodeName)}>{children}</Text>
}

function processBlockNode (node, parentKey) {
  var key = `${parentKey}_${node.nodeName}`
  let children = []
  var lastInlineNodes = []

  node.childNodes.forEach((childNode, index) => {
    var child = processNode(childNode, `${key}_${index}`)
    if (isInlineElement(childNode.nodeName) || isText(childNode.nodeName)) {
      lastInlineNodes.push(child)
    } else if (isBlockElement(childNode.nodeName)) {
      if (lastInlineNodes.length > 0) {
        children.push(<Text key={`${key}_${index}_inline`}>{lastInlineNodes}</Text>)
        lastInlineNodes = []
      }
      children.push(child)
    }
  })

  if (lastInlineNodes.length > 0) {
    children.push((<Text key={`${key}_last_inline`}>{lastInlineNodes}</Text>))
  }

  return <View key={key} style={styleForTag(node.nodeName)}>
  {children}
  </View>
}

