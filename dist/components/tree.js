'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tree = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = require('react-bootstrap');

var _nodeContainer = require('./nodeContainer');

var _tree = require('../styles/tree.css');

var _tree2 = _interopRequireDefault(_tree);

var _nodeContainer2 = require('../styles/nodeContainer.css');

var _nodeContainer3 = _interopRequireDefault(_nodeContainer2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Tree = exports.Tree = function (_React$Component) {
  _inherits(Tree, _React$Component);

  function Tree(props) {
    _classCallCheck(this, Tree);

    var _this = _possibleConstructorReturn(this, (Tree.__proto__ || Object.getPrototypeOf(Tree)).call(this, props));

    _this.state = {};
    _this._setFilterActual.bind(_this);
    props.renderNodeToggle.bind(_this);
    props.renderNodeAction.bind(_this);
    return _this;
  }

  _createClass(Tree, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (this.state.filter && this.state.filter.length > 0) {
        this._applyFilter(this.state.filter.toLowerCase(), nextProps.nodes);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        _reactBootstrap.Panel,
        { style: _tree2.default, className: 'react-tree-container', header: this.props.header },
        this.renderNodes()
      );
    }
  }, {
    key: 'renderNodes',
    value: function renderNodes() {
      // console.log('in renderNodes')
      var nodes = [];
      // console.log(this.props.sortFunc)
      this.props.nodes.sort(this.props.sortFunc);
      for (var i = 0; i < this.props.nodes.length; i++) {
        nodes.push(this.renderNodeContainer(this.props.nodes[i]));
      }
      return nodes;
    }
  }, {
    key: '_setFilterActual',
    value: function _setFilterActual(filter) {
      this._applyFilter(filter, this.props.nodes);
      this.forceUpdate();
    }
  }, {
    key: 'setFilter',
    value: function setFilter(filter) {
      var _this2 = this;

      this.setState({ filter: filter.toLowerCase() });
      if (this.state.setFilterTimeout) {
        clearTimeout(this.state.setFilterTimeout);
      }

      this.setState({ setFilterTimeout: setTimeout(function () {
          return _this2._setFilterActual(filter.toLowerCase());
        }, 300) });
    }
  }, {
    key: '_childrenMatch',
    value: function _childrenMatch(filter, node) {
      if (node.children && node.children instanceof Array) {
        for (var i = 0; i < node.children.length; i++) {
          if (node.children[i][this.props.titlePropertyPath].toLowerCase().indexOf(filter) > -1) {
            return true;
          } else if (this._childrenMatch(filter, node.children[i])) {
            return true;
          }
        }
      }
      return false;
    }
  }, {
    key: '_applyFilter',
    value: function _applyFilter(filter, nodes) {
      if (filter.length > 0) {
        for (var i = 0; i < nodes.length; i++) {
          if (nodes[i][this.props.titlePropertyPath].toLowerCase().indexOf(filter) > -1) {
            // THIS NODE MATCHES
            nodes[i].hidden = false;

            nodes[i].open = true;
          } else if (this._childrenMatch(filter, nodes[i])) {
            nodes[i].hidden = false;
            nodes[i].open = true;
          } else {
            nodes[i].hidden = true;
            nodes[i].open = false;
          }

          if (nodes[i].children) {
            this._applyFilter(filter, nodes[i].children);
          }
        }
      } else {
        for (var j = 0; j < nodes.length; j++) {
          nodes[j].hidden = false;
          nodes[j].open = false;
          if (nodes[j].children) {
            this._applyFilter(filter, nodes[j].children);
          }
        }
      }
    }
  }, {
    key: 'renderNodeContainer',
    value: function renderNodeContainer(node) {
      // console.log('in renderNodeContainer')
      // console.log(NodeContainer)
      return _react2.default.createElement(_nodeContainer.NodeContainer, { style: _nodeContainer3.default,
        key: node.nodeId,
        actions: this.props.actions,
        tree: this,
        parentId: '-1',
        isEditable: this.props.isEditable,
        sortFunc: this.props.sortFunc,
        onDropNode: this.props.onDropNode,
        onNodeClick: this.props.onNodeClick,
        renderNodeToggle: this.props.renderNodeToggle,
        renderNodeAction: this.props.renderNodeAction,
        renderNodeTitle: this.props.renderNodeTitle,
        onToggleClick: this.props.onToggleClick,
        node: node });
    }
  }, {
    key: 'toggleClickHandler',
    value: function toggleClickHandler(node) {
      this.props.onToggleClick(node);
    }
  }]);

  return Tree;
}(_react2.default.Component);

Tree.propTypes = {
  nodes: _react2.default.PropTypes.array.isRequired,
  sortKey: _react2.default.PropTypes.string,
  isEditable: _react2.default.PropTypes.bool,
  header: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.element]),
  actions: _react2.default.PropTypes.array,
  renderNodeToggle: _react2.default.PropTypes.func,
  renderNodeTitle: _react2.default.PropTypes.func,
  renderNodeAction: _react2.default.PropTypes.func,
  onNodeClick: _react2.default.PropTypes.func,
  onDropNode: _react2.default.PropTypes.func,
  sortFunc: _react2.default.PropTypes.func,
  renderFooter: _react2.default.PropTypes.func,
  onToggleClick: _react2.default.PropTypes.func,
  onAction: _react2.default.PropTypes.func,
  titlePropertyPath: _react2.default.PropTypes.string
};

Tree.defaultProps = {
  renderNodeAction: function renderNodeAction(node, action, actionHandler) {
    return _react2.default.createElement(
      _reactBootstrap.Button,
      {
        bsStyle: 'link',
        bsSize: 'small',
        key: action,
        className: 'react-tree-node-action',
        onClick: actionHandler },
      _react2.default.createElement(_reactBootstrap.Glyphicon, { glyph: action.icon })
    );
  },
  titlePropertyPath: 'title',
  sortFunc: function sortFunc(a, b) {
    return a.rank - b.rank;
  },
  renderNodeTitle: function renderNodeTitle(node) {
    return _react2.default.createElement(
      'div',
      { className: 'react-tree-node-title' },
      node.name
    );
  },
  onDropNode: function onDropNode(source, newParent, rank) {
    console.log('In onDropNode');
    console.log(source);
    console.log(newParent);
    console.log(rank);
  },
  renderNodeToggle: function renderNodeToggle(node, clickHandler) {
    if (node.children && node.children instanceof Array) {
      return _react2.default.createElement(
        _reactBootstrap.Button,
        { bsSize: 'xsmall', bsStyle: 'link', className: 'react-tree-node-toggle', onClick: clickHandler },
        _react2.default.createElement(_reactBootstrap.Glyphicon, { glyph: node.open ? 'folder-open' : 'folder-close' })
      );
    } else {
      return _react2.default.createElement(
        _reactBootstrap.Button,
        {
          bsSize: 'xsmall',
          bsStyle: 'link',
          disabled: true,
          style: { 'cursor': 'default' },
          className: 'react-tree-node-toggle' },
        _react2.default.createElement(_reactBootstrap.Glyphicon, { glyph: 'cog' })
      );
    }
  }
};