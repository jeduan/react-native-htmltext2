import DEFAULT_STYLES from './default-styles'
import React, {View, Text} from 'react-native'

var BLOCK_ELEMENTS = ['blockquote', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'ol', 'p', 'pre', 'ul', 'li']

var INLINE_ELEMENTS = ['b', 'i', 'em', 'strong', 'a', 'br', 'q', 'span', 'sub', 'sup']

function styleForTag (tagName) {
  var style = DEFAULT_STYLES[tagName] ? DEFAULT_STYLES[tagName] : DEFAULT_STYLES['default']
  return style
}

function isText (node) : Boolean {
  return node && node.nodeName === '#text'
}

function isBlockElement (node) : Boolean {
  return node && BLOCK_ELEMENTS.includes(node.nodeName)
}

function isInlineElement (node) : Boolean {
  return node && INLINE_ELEMENTS.includes(node.nodeName)
}

export default function processNode (node, parentKey) {
  if (isText(node)) {
    console.info('rendering text', node.value)
    return processTextNode(node, parentKey)
  }

  if (isInlineElement(node)) {
    console.info('rendering inline element %s', node.nodeName)
    return processInlineNode(node, parentKey)
  }

  if (isBlockElement(node)) {
    console.info('rendering block element %s', node.nodeName)
    return processBlockNode(node, parentKey)
  }

  console.warn(`unsupported node: ${JSON.stringify(node)}`)
  return null
}

function processTextNode (node, parentKey) {
  let key = `${parentKey}_text`
  return <Text key={key}>{node.value}</Text>
}

function processInlineNode (node, parentKey) {
  let key = `${parentKey}_${node.nodeName}`
  var unsupportedElements : Array = node.childNodes.filter(
    (node) => !(isInlineElement(node) || isText(node))
  )
  if (unsupportedElements.length) {
    console.log(unsupportedElements)
    unsupportedElements.forEach(
      (child) => {
        console.error(`Inline element ${node.nodeName} can only have inline children, ${child} is invalid!`)
      }
    )
  }

  var children = node.childNodes.filter(
    (node) => isInlineElement(node) || isText(node)
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
    if (isInlineElement(childNode) || isText(childNode)) {
      lastInlineNodes.push(child)
    } else if (isBlockElement(childNode)) {
      if (lastInlineNodes.length > 0) {
        children.push(lastInlineNodes)
        lastInlineNodes = []
      }
      children.push(child)
    }
  })

  if (lastInlineNodes.length > 0) {
    children.push(lastInlineNodes)
  }

  return <View key={key} style={styleForTag(node.nodeName)}>
    {children}
  </View>
}

