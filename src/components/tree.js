import React from 'react'
import { Button, Glyphicon, Panel } from 'react-bootstrap'
import { NodeContainer } from './nodeContainer'

import treeStyle from '../styles/tree.css'
import nodeContainerStyle from '../styles/nodeContainer.css'

export class Tree extends React.Component {

  constructor (props) {
    super(props)
    this.state = {}
    this._setFilterActual.bind(this)
    props.renderNodeToggle.bind(this)
    props.renderNodeAction.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (this.state.filter && this.state.filter.length > 0) {
      this._applyFilter(this.state.filter.toLowerCase(), nextProps.nodes)
    }
  }

  render () {
    return (
      <Panel style={treeStyle} className='react-tree-container' header={this.props.header} >
        {this.renderNodes()}
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

  _setFilterActual (filter) {
    this._applyFilter(filter, this.props.nodes)
    this.forceUpdate()
  }

  setFilter (filter) {
    this.setState({ filter: filter.toLowerCase() })
    if (this.state.setFilterTimeout) {
      clearTimeout(this.state.setFilterTimeout)
    }

    this.setState({ setFilterTimeout: setTimeout(() => this._setFilterActual(filter.toLowerCase()), 300) })
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
    if (filter.length > 0) {
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
    } else {
      for (var j = 0; j < nodes.length; j++) {
        nodes[j].hidden = false
        nodes[j].open = false
        if (nodes[j].children) {
          this._applyFilter(filter, nodes[j].children)
        }
      }
    }
  }

  renderNodeContainer (node) {
    // console.log('in renderNodeContainer')
    // console.log(NodeContainer)
    return (
      <NodeContainer style={nodeContainerStyle}
        key={node.nodeId}
        actions={this.props.actions}
        tree={this}
        parentId='-1'
        isEditable={this.props.isEditable}
        sortFunc={this.props.sortFunc}
        onDropNode={this.props.onDropNode}
        onNodeClick={this.props.onNodeClick}
        onNodeDoubleClick={this.props.onNodeDoubleClick}
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
  actions: React.PropTypes.array,
  renderNodeToggle: React.PropTypes.func,
  renderNodeTitle: React.PropTypes.func,
  renderNodeAction: React.PropTypes.func,
  onNodeClick: React.PropTypes.func,
  onNodeDoubleClick: React.PropTypes.func,
  onDropNode: React.PropTypes.func,
  sortFunc: React.PropTypes.func,
  renderFooter: React.PropTypes.func,
  onToggleClick: React.PropTypes.func,
  onAction: React.PropTypes.func,
  titlePropertyPath: React.PropTypes.string
}

Tree.defaultProps = {
  renderNodeAction: (node, action, actionHandler) => {
    return (
      <Button
        bsStyle='link'
        bsSize='small'
        key={action}
        className='react-tree-node-action'
        onClick={actionHandler}>
        <Glyphicon glyph={action.icon} />
      </Button>)
  },
  titlePropertyPath: 'title',
  sortFunc: (a, b) => {
    return a.rank - b.rank
  },
  renderNodeTitle: (node) => {
    return (
      <div className='react-tree-node-title'>{node.name}</div>
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
