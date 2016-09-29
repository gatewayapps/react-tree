import React from 'react'
import { Label } from 'react-bootstrap'
import { Tree } from '../src'
console.log('hello')
var nodes = [
  {
    id: 1,
    title: 'Test This is a super long title in your face justin',
    open: false,
    rank: 1,
    children: [
      {
        id: 2,
        rank: 1,
        title: 'node1',
        open: false
      },
      {
        id: 3,
        rank: 0,
        title: 'node2',
        open: false
      }
    ],
    actions:[
      { name: 'add', icon: 'plus', title: 'Add Node' }
    ]
  },
  {
    id: 4,
    title: 'Test',
    rank: 2,
    open: false,
    children: [
      {
        id: 5,
        rank: 1,
        title: 'node1',
        open: false
      },
      {
        id: 6,
        rank: 2,
        title: 'node2',
        open: false,
        children: [
          {
            id: 7,
            rank: 1,
            title: 'node1',
            open: false
          },
          {
            id: 8,
            rank: 2,
            title: 'node2',
            open: false
          }
        ]
      }
    ]
  }
]

function toggleNodeOpen (id, localNodes = nodes) {
  for (var i = 0; i < localNodes.length; i++) {
    if (localNodes[i].id === id) {
      localNodes[i].open = !localNodes[i].open
    } else {
      if (localNodes[i].children !== undefined) {
        toggleNodeOpen(id, localNodes[i].children)
      }
    }
  }
}

const Example = React.createClass({

  render () {
    const header = <Label>Hello!</Label>
    return <div style={{ 'maxWidth': '300px' }}><Tree nodes={nodes}
      header={header}
      isEditable={false}
      onToggleClick={(node) => {
        toggleNodeOpen(node.id)
        this.forceUpdate()
      }} /></div>
  }
})

export default Example
