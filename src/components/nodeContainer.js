'use strict'

import React from 'react'
import { Clearfix } from 'react-bootstrap'

export class NodeContainer extends React.Component {
  render () {
    return (
      <div style={this.props.style} className='react-tree-node-container' key={this.props.node.id}>
        <div className='react-tree-node-header'>
          {this.props.renderNodeToggle(this.props.node, () => {
            this.props.node.open = !this.props.node.open
            this.forceUpdate()
          }) }
          {this.props.renderNodeTitle(this.props.node) }
          {this.renderActions() }
          <Clearfix />
        </div>
        {this.renderChildren()}
      </div>
    )
  }

  renderChildren () {
    if (this.props.node.children !== undefined && this.props.node.children instanceof Array && this.props.node.open) {
      var children = []
      for (var i = 0; i < this.props.node.children.length; i++) {
        children.push(
          <NodeContainer style={this.props.style}
            key={this.props.node.children[i].id}
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
  onToggleClick: React.PropTypes.func,
  node: React.PropTypes.object.isRequired,
  style: React.PropTypes.object
}

