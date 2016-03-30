import './install-mock.js'
import test from 'tape'
import {parseFragment} from 'parse5'
import {shallow} from 'enzyme'
import processNode from './process-node'

test('Should render text', (t) => {
  var fragment = parseFragment('hello world')
  var node = processNode(fragment.childNodes[0], 'foo')
  var wrapper = shallow(node)

  t.ok(wrapper.text() === 'hello world', 'Has the text')
  t.end()
})
