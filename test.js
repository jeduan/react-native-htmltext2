import './install-mock.js'
import test from 'tape'
import {parseFragment} from 'parse5'
import {mount as render} from 'enzyme'
import processNode from './process-node'
import jsdom from 'jsdom'
const doc = jsdom.jsdom('<!doctype html><html><body></body></html>')
const win = doc.defaultView
global.document = doc
global.window = win

test('Should render text', (t) => {
  var fragment = parseFragment('hello world')
  var node = processNode(fragment.childNodes[0], 'foo')
  var wrapper = render(node)

  t.ok(wrapper.text() === 'hello world', 'Has the text')
  t.end()
})

test('Should render inline elements', (t) => {
  var fragment = parseFragment('<span><b>hello</b> world</span>')
  var node = processNode(fragment.childNodes[0], 'foo')
  var wrapper = render(node)

  t.equals(wrapper.text(), 'hello world', 'Has the text')
  t.equals(wrapper.html(), '<div><div style="font-weight:bold;"><div>hello</div></div><div> world</div></div>', 'Renders html correctly')
  t.end()
})

test('Renders block elements', (t) => {
  var fragment = parseFragment('<p>Hello</p>')
  var node = processNode(fragment.childNodes[0], 'foo')
  var wrapper = render(node)

  t.equals(wrapper.text(), 'Hello', 'Has the text')
  t.equals(wrapper.html(), '<div style="margin-bottom:12px;"><div>Hello</div></div>', 'Renders html correctly')
  t.end()
})

test('Renders block elements with inline elements', (t) => {
  var fragment = parseFragment('<p>Hello <b>world</b></p>')
  var node = processNode(fragment.childNodes[0], 'foo')
  var wrapper = render(node)

  t.equals(wrapper.text(), 'Hello world', 'Has the text')
  t.equals(wrapper.html(), '<div style="margin-bottom:12px;"><div>Hello </div><div style="font-weight:bold;"><div>world</div></div></div>', 'Renders html correctly')
  t.end()
})
