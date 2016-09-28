import React from 'react'
import { Label } from 'react-bootstrap'
import { Tree } from '../src'
console.log('hello')
var nodes = [
  {
    id: 1,
    title: 'Test This is a super long title in your face justin',
    open: false,
    children: [
      {
        id: 2,
        title: 'node1',
        open: false
      },
      {
        id: 3,
        title: 'node2',
        open: false
      }
    ],
    actions:[
      { name: 'add', icon: 'plus' }
    ]
  },
  {
    id: 4,
    title: 'Test',
    open: false,
    children: [
      {
        id: 5,
        title: 'node1',
        open: false
      },
      {
        id: 6,
        title: 'node2',
        open: false,
        children: [
          {
            id: 7,
            title: 'node1',
            open: false
          },
          {
            id: 8,
            title: 'node2',
            open: false
          }
        ]
      }
    ]
  }

]

const Example = React.createClass({

  render () {
    const header = <Label>Hello!</Label>
    return <Tree nodes={nodes}
      header={header}
      isEditable={false}
      onToggleClick={(node) => {
      }} />
  }
})

export default Example
