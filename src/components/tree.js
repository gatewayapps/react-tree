import React from 'react'
import { Button, Glyphicon, Panel } from 'react-bootstrap'
import { NodeContainer } from './nodeContainer'

import treeStyle from '../styles/tree.css'
import nodeContainerStyle from '../styles/nodeContainer.css'

export class Tree extends React.Component {

  constructor (props) {
    super(props)
    this.state = {}
    props.renderNodeToggle.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (this.state.filter && this.state.filter.length > 0) {
      this._applyFilter(this.state.filter.toLowerCase(), nextProps.nodes)
    }
  }

  render () {
    return (
      <Panel style={treeStyle} className='react-tree-container' header={this.props.header} >
        {this.renderNodes() }
      </Panel>
    )
  }

  renderNodes () {
    // console.log('in renderNodes')
    var nodes = []
    // console.log(this.props.sortFunc)
    this.props.nodes.sort(this.props.sortFunc)
    for (var i = 0; i < this.props.nodes.length; i++) {
      nodes.push(this.renderNodeContainer(this.props.nodes[i]))
    }
    return nodes
  }

  setFilter (filter) {
    this.setState({ filter: filter.toLowerCase() })
    this._applyFilter(filter.toLowerCase(), this.props.nodes)
    this.forceUpdate()
  }

  _childrenMatch (filter, node) {
    if (node.children && node.children instanceof Array) {
      for (var i = 0; i < node.children.length; i++) {
        if (node.children[i][this.props.titlePropertyPath].toLowerCase().indexOf(filter) > -1) {
          return true
        } else if (this._childrenMatch(filter, node.children[i])) {
          return true
        }
      }
    }
    return false
  }

  _applyFilter (filter, nodes) {
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i][this.props.titlePropertyPath].toLowerCase().indexOf(filter) > -1) {
        // THIS NODE MATCHES
        nodes[i].hidden = false

        nodes[i].open = true
      } else if (this._childrenMatch(filter, nodes[i])) {
        nodes[i].hidden = false
        nodes[i].open = true
      } else {
        nodes[i].hidden = true
        nodes[i].open = false
      }

      if (nodes[i].children) {
        this._applyFilter(filter, nodes[i].children)
      }
    }
  }

  renderNodeContainer (node) {
    // console.log('in renderNodeContainer')
    // console.log(NodeContainer)
    return (
      <NodeContainer style={nodeContainerStyle}
        key={node.id}
        tree={this}
        isEditable={this.props.isEditable}
        sortFunc={this.props.sortFunc}
        onDropNode={this.props.onDropNode}
        onNodeClick={this.props.onNodeClick}
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
  isEditable: React.PropTypes.bool,
  header: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.element
  ]),
  renderNodeToggle: React.PropTypes.func,
  renderNodeTitle: React.PropTypes.func,
  renderNodeAction: React.PropTypes.func,
  onNodeClick: React.PropTypes.func,
  onDropNode: React.PropTypes.func,
  sortFunc: React.PropTypes.func,
  renderFooter: React.PropTypes.func,
  onToggleClick: React.PropTypes.func,
  onAction: React.PropTypes.func,
  titlePropertyPath: React.PropTypes.string
}

Tree.defaultProps = {
  renderNodeAction: (node, action) => {
    return (
      <Button
        bsStyle='link'
        bsSize='small'
        key={action}
        className='react-tree-node-action'
        onClick={() => { this.props.onAction(node, action) }}>
        <Glyphicon glyph={action.icon} />
      </Button>)
  },
  titlePropertyPath: 'title',
  sortFunc: (a, b) => {
    return a.rank - b.rank
  },
  renderNodeTitle: (node) => {
    return (
      <div className='react-tree-node-title'>{node.title}</div>
    )
  },
  onDropNode: (source, newParent, rank) => {
    console.log('In onDropNode')
    console.log(source)
    console.log(newParent)
    console.log(rank)
  },
  renderNodeToggle: (node, clickHandler) => {
    if (node.children && node.children instanceof Array) {
      return (
        <Button bsSize='xsmall' bsStyle='link' className='react-tree-node-toggle' onClick={clickHandler}>
          <Glyphicon glyph={node.open ? 'folder-open' : 'folder-close'} />
        </Button>
      )
    } else {
      return (
        <Button
          bsSize='xsmall'
          bsStyle='link'
          disabled
          style={{ 'cursor': 'default' }}
          className='react-tree-node-toggle'>
          <Glyphicon glyph='cog' />
        </Button>)
    }
  }
}
