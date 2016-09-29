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
    console.log(headerStyle)
    return (
      <div
        style={this.props.style}
        data-id={this.props.node.id}
        className='react-tree-node-container'
        key={this.props.node.id}>
        <div
          className='react-tree-node-header'
          draggable
          style={headerStyle}
          onDragStart={(e) => { this.onDragStart(e) }}
          onDragLeave={(e) => { this.onDragLeave(e) }}
          onDragOver={(e) => { this.onDragOver(e) }}
          onDrop={(e) => { this.onDrop(e) }}
          title={this.props.node.title}>
          {this.props.renderNodeToggle(this.props.node, () => { this.onClickToggle() }) }
          {this.props.renderNodeTitle(this.props.node) }
          {this.renderActions() }
          <Clearfix />
        </div>
        {this.renderChildren()}
      </div>
    )
  }

  onDragLeave (e) {
    this.setState({ dragPosition: undefined })
  }

  onDrop (e) {
    this.setState({ dragPosition: undefined })
    console.log(e)
  }

  onClickToggle () {
    this.props.onToggleClick(this.props.node)
  }

  onDragStart (e) {
    console.log('dragging')
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
            key={this.props.node.children[i].id}
            sortFunc={this.props.sortFunc}
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
    if (this.props.node.actions !== undefined && this.props.node.actions instanceof Array) {
      var actions = []
      for (var i = 0; i < this.props.node.actions.length; i++) {
        actions.push(this.props.renderNodeAction(this.props.node, this.props.node.actions[i]))
      }
      return (
        <div className='react-tree-node-actions'>
          {actions}
        </div>
      )
    }
  }

}

NodeContainer.propTypes = {
  renderNodeToggle: React.PropTypes.func.isRequired,
  renderNodeTitle: React.PropTypes.func.isRequired,
  renderNodeAction: React.PropTypes.func.isRequired,
  sortFunc: React.PropTypes.func.isRequired,
  onToggleClick: React.PropTypes.func,
  node: React.PropTypes.object.isRequired,
  style: React.PropTypes.object
}

