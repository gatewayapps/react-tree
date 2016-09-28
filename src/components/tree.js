import React from 'react'
import { Button, Glyphicon, Panel } from 'react-bootstrap'
import { NodeContainer } from './nodeContainer'

import treeStyle from '../styles/tree.css'
import nodeContainerStyle from '../styles/nodeContainer.css'

export class Tree extends React.Component {

  constructor (props) {
    super(props)
    props.renderNodeToggle.bind(this)
  }

  render () {
    return (
      <Panel style={treeStyle} header={this.props.header} >
        {this.renderNodes() }
      </Panel>
    )
  }

  renderNodes () {
    console.log('in renderNodes')
    var nodes = []
    for (var i = 0; i < this.props.nodes.length; i++) {
      nodes.push(this.renderNodeContainer(this.props.nodes[i]))
    }
    return nodes
  }

  renderNodeContainer (node) {
    console.log('in renderNodeContainer')
    console.log(NodeContainer)
    return (
      <NodeContainer style={nodeContainerStyle}
        key={node.id}
        renderNodeToggle={this.props.renderNodeToggle}
        renderNodeAction={this.props.renderNodeAction}
        renderNodeTitle={this.props.renderNodeTitle}
        onToggleClick={this.props.onToggleClick}
        node={node} />
    )
  }

  toggleClickHandler (node) {
    this.props.onToggleClick(node)
  }
}

Tree.propTypes = {
  nodes: React.PropTypes.array.isRequired,
  sortKey: React.PropTypes.string,
  filter: React.PropTypes.string,
  isEditable: React.PropTypes.bool,
  header: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.element
  ]),
  renderNodeToggle: React.PropTypes.func,
  renderNodeTitle: React.PropTypes.func,
  renderNodeAction: React.PropTypes.func,
  renderFooter: React.PropTypes.func,
  onToggleClick: React.PropTypes.func,
  onAction: React.PropTypes.func
}

Tree.defaultProps = {
  renderNodeAction: (node, action) => {
    return (
      <Button
        bsStyle='link'
        bsSize='small'
        className='react-tree-node-action'
        onClick={() => { this.props.onAction(node, action) }}>
        <Glyphicon glyph={action.icon} />
      </Button>)
  },
  renderNodeTitle: (node) => {
    return (
      <div className='react-tree-node-title'>{node.title}</div>
    )
  },
  renderNodeToggle: (node, clickHandler) => {
    if (node.children && node.children instanceof Array) {
      return (
        <div className='react-tree-node-toggle' onClick={clickHandler}>
          <Glyphicon glyph={node.open ? 'menu-down' : 'menu-right'} />
        </div>
      )
    } else {
      return <div className='react-tree-node-toggle'> <Glyphicon glyph='cog' /></div>
    }
  }
}
