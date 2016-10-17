'use strict'

import React from 'react'
import { Clearfix } from 'react-bootstrap'

function findAncestor (el, cls) {
  while ((el = el.parentElement) && !el.classList.contains(cls));
  return el
}

export class NodeContainer extends React.Component {

  constructor (props) {
    super(props)
    this.onDragStart.bind(this)
    this.onDragOver.bind(this)
    this.onDragLeave.bind(this)
    this.onClickToggle.bind(this)
    this.onDrop.bind(this)
  }

  render () {
    if (this.props.node.hidden) {
      return <span />
    }

    var headerStyle = {}
    if (this.state && this.state.dragPosition) {
      switch (this.state.dragPosition) {
        case 'above':
          {
            headerStyle = { 'borderTop': '2px solid LightBlue' }
            break
          }
        case 'child':
          {
            headerStyle = { backgroundColor: 'LightBlue' }
            break
          }
        case 'below':
          {
            headerStyle = { 'borderBottom': '2px solid LightBlue' }
            break
          }
      }
    }
    // console.log('Node Active: ' + this.props.node.active)
    if (this.props.isEditable) {
      return (
        <div
          style={this.props.style}
          data-id={this.props.node.nodeId}
          className='react-tree-node-container'
          key={this.props.node.nodeId}>
          <div
            className='react-tree-node-header'
            ref={node => node && node.setAttribute('active', this.props.node.active ? 'active' : 'false')}
            onClick={(e) => { if (e.target.nodeName === 'DIV') { this.props.onNodeClick(this.props.node) } }}
            draggable
            style={headerStyle}

            onDragStart={(e) => { this.onDragStart(e) }}
            onDragLeave={(e) => { this.onDragLeave(e) }}
            onDragOver={(e) => { this.onDragOver(e) }}
            onDrop={(e) => { this.onDrop(e) }}
            title={this.props.node.title}>
            {this.props.renderNodeToggle(this.props.node, () => { this.onClickToggle() })}
            {this.props.renderNodeTitle(this.props.node)}
            {this.renderActions()}
            <Clearfix />
          </div>
          {this.renderChildren()}
        </div>
      )
    } else {
      return (
        <div
          style={this.props.style}
          data-id={this.props.node.nodeId}
          className='react-tree-node-container'
          key={this.props.node.nodeId}>
          <div
            active={this.props.node.active ? 'active' : 'false'}
            className='react-tree-node-header'
            style={headerStyle}
            title={this.props.node.title}>
            {this.props.renderNodeToggle(this.props.node, () => { this.onClickToggle() })}
            {this.props.renderNodeTitle(this.props.node)}
            {this.renderActions()}
            <Clearfix />
          </div>
          {this.renderChildren()}
        </div>
      )
    }
  }

  onDragLeave (e) {
    this.setState({ dragPosition: undefined })
  }

  onDrop (e) {
    var pos = this.state.dragPosition
    var rank = this.props.node.rank
    if (pos === 'below') {
      rank++
    }
    var data = e.dataTransfer.getData('text/plain')
    // console.log(data)
    var obj = JSON.parse(data)
    // console.log(obj)
    console.log(this.props)
    this.props.onDropNode(obj, this.props.parentId, rank)

    this.setState({ dragPosition: undefined })
  }

  onClickToggle () {
    this.props.onToggleClick(this.props.node)
  }

  onDragStart (e) {
    // console.log('dragging')
    this.props.node.open = false
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', JSON.stringify(this.props.node))
    this.forceUpdate()
  }

  onDragOver (e) {
    e.preventDefault()
    e.dataTransfer.effectAllowed = 'move'
    var header = findAncestor(e.target, 'react-tree-node-header')
    if (header) {
      const rect = header.getBoundingClientRect()

      if (header.parentNode.childNodes.length === 2) {
        const qH = rect.height / 5.0

        if (e.pageY <= rect.top + (2.0 * qH)) {
          this.setState({ dragPosition: 'above' })
        } else if (e.pageY <= rect.top + 3 * qH) {
          this.setState({ dragPosition: 'child' })
        } else {
          this.setState({ dragPosition: 'below' })
        }
      } else {
        const qH = rect.height / 2.0

        if (e.pageY <= rect.top + qH) {
          this.setState({ dragPosition: 'above' })
        } else {
          this.setState({ dragPosition: 'below' })
        }
      }

      this.forceUpdate()
    }
  }

  renderChildren () {
    if (this.props.node.children !== undefined && this.props.node.children instanceof Array && this.props.node.open) {
      this.props.node.children.sort(this.props.sortFunc)

      var children = []
      for (var i = 0; i < this.props.node.children.length; i++) {
        children.push(
          <NodeContainer style={this.props.style}
            parentId={this.props.node.nodeId}
            tree={this.props.tree}
            actions={this.props.actions}
            isEditable={this.props.isEditable}
            key={this.props.node.children[i].nodeId}
            sortFunc={this.props.sortFunc}
            onDropNode={this.props.onDropNode}
            onNodeClick={this.props.onNodeClick}
            renderNodeToggle={this.props.renderNodeToggle}
            renderNodeAction={this.props.renderNodeAction}
            renderNodeTitle={this.props.renderNodeTitle}
            onToggleClick={this.props.onToggleClick}
            node={this.props.node.children[i]} />
        )
      }
      return (<div className='react-tree-node-children'>{children}</div>)
    }
  }

  renderActions () {
    if (this.props.actions !== undefined && this.props.actions instanceof Array) {
      var actions = []
      for (var i = 0; i < this.props.actions.length; i++) {
        var action = this.props.renderNodeAction(this.props.node, this.props.actions[i])
        if (action !== undefined) {
          actions.push(this.props.renderNodeAction(this.props.node, this.props.actions[i]))
        }
      }
      if (actions.length > 0) {
        return (
          <div className='react-tree-node-actions'>
            {actions}
          </div>
        )
      }
    }
  }

}

NodeContainer.propTypes = {
  renderNodeToggle: React.PropTypes.func.isRequired,
  renderNodeTitle: React.PropTypes.func.isRequired,
  tree: React.PropTypes.element.isRequired,
  hidden: React.PropTypes.bool,
  actions: React.PropTypes.array,
  renderNodeAction: React.PropTypes.func.isRequired,
  onNodeClick: React.PropTypes.func,
  parentId: React.PropTypes.string.isRequired,
  sortFunc: React.PropTypes.func.isRequired,
  isEditable: React.PropTypes.bool,
  onToggleClick: React.PropTypes.func,
  node: React.PropTypes.object.isRequired,
  onDropNode: React.PropTypes.func.isRequired,
  style: React.PropTypes.object
}

