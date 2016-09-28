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

var _nodeContainer2 = _interopRequireDefault(_nodeContainer);

var _tree = require('../styles/tree.css');

var _tree2 = _interopRequireDefault(_tree);

var _nodeContainer3 = require('../styles/nodeContainer.css');

var _nodeContainer4 = _interopRequireDefault(_nodeContainer3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Tree = exports.Tree = function (_React$Component) {
  _inherits(Tree, _React$Component);

  function Tree() {
    _classCallCheck(this, Tree);

    return _possibleConstructorReturn(this, (Tree.__proto__ || Object.getPrototypeOf(Tree)).apply(this, arguments));
  }

  _createClass(Tree, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        _reactBootstrap.Panel,
        { style: _tree2.default, header: this.props.header },
        this.renderNodes()
      );
    }
  }, {
    key: 'renderNodes',
    value: function renderNodes() {
      var nodes = [];
      for (var i = 0; i < this.props.nodes.length; i++) {
        nodes.push(this.renderNodeContainer(this.props.nodes[i]));
      }
      return nodes;
    }
  }, {
    key: 'renderNodeContainer',
    value: function renderNodeContainer(node) {
      return _react2.default.createElement(_nodeContainer2.default, { style: _nodeContainer4.default,
        renderNodeToggle: this.props.renderNodeToggle,
        renderNodeAction: this.props.renderNodeAction,
        renderNodeTitle: this.props.renderNodeTitle,
        node: node });
    }
  }]);

  return Tree;
}(_react2.default.Component);

Tree.propTypes = {
  nodes: _react2.default.PropTypes.array.isRequired,
  sortKey: _react2.default.PropTypes.string,
  filter: _react2.default.PropTypes.string,
  editable: _react2.default.PropTypes.boolean,
  header: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.element]),
  renderNodeToggle: _react2.default.PropTypes.func,
  renderNodeTitle: _react2.default.PropTypes.func,
  renderNodeAction: _react2.default.PropTypes.func,
  renderFooter: _react2.default.PropTypes.func,
  onAction: _react2.default.PropTypes.func
};

Tree.defaultProps = {
  renderNodeAction: function renderNodeAction(node, action) {
    return _react2.default.createElement(
      _reactBootstrap.Button,
      {
        bsStyle: 'link',
        bsSize: 'xssmall',
        className: 'react-tree-node-action',
        onClick: function onClick() {
          undefined.props.onAction(node, action);
        } },
      _react2.default.createElement(_reactBootstrap.Glyphicon, { glyph: action.icon })
    );
  },
  renderNodeTitle: function renderNodeTitle(node) {
    return _react2.default.createElement(
      'div',
      { className: 'react-tree-node-title' },
      node.title
    );
  },
  renderNodeToggle: function renderNodeToggle(node) {
    return _react2.default.createElement(
      'div',
      { className: 'react-tree-node-toggle' },
      _react2.default.createElement(_reactBootstrap.Glyphicon, { glyph: node.open ? 'triangle-down' : 'triangle-right' })
    );
  }
};