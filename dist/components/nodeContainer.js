'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NodeContainer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = require('react-bootstrap');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function findAncestor(el, cls) {
  while ((el = el.parentElement) && !el.classList.contains(cls)) {}
  return el;
}

var NodeContainer = exports.NodeContainer = function (_React$Component) {
  _inherits(NodeContainer, _React$Component);

  function NodeContainer(props) {
    _classCallCheck(this, NodeContainer);

    var _this = _possibleConstructorReturn(this, (NodeContainer.__proto__ || Object.getPrototypeOf(NodeContainer)).call(this, props));

    _this.onDragStart.bind(_this);
    _this.onDragOver.bind(_this);
    _this.onDragLeave.bind(_this);
    _this.onClickToggle.bind(_this);
    _this.onDrop.bind(_this);
    return _this;
  }

  _createClass(NodeContainer, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      if (this.props.node.hidden) {
        return _react2.default.createElement('span', null);
      }

      var headerStyle = {};
      if (this.state && this.state.dragPosition) {
        switch (this.state.dragPosition) {
          case 'above':
            {
              headerStyle = { 'borderTop': '2px solid LightBlue' };
              break;
            }
          case 'child':
            {
              headerStyle = { backgroundColor: 'LightBlue' };
              break;
            }
          case 'below':
            {
              headerStyle = { 'borderBottom': '2px solid LightBlue' };
              break;
            }
        }
      }
      // console.log('Node Active: ' + this.props.node.active)
      if (this.props.isEditable) {
        return _react2.default.createElement(
          'div',
          {
            style: this.props.style,
            'data-id': this.props.node.id,
            className: 'react-tree-node-container',
            key: this.props.node.id },
          _react2.default.createElement(
            'div',
            {
              className: 'react-tree-node-header',
              ref: function ref(node) {
                return node && node.setAttribute('active', _this2.props.node.active ? 'active' : 'false');
              },
              onClick: function onClick(e) {
                if (e.target.nodeName === 'DIV') {
                  _this2.props.onNodeClick(_this2.props.node);
                }
              },
              draggable: true,
              style: headerStyle,

              onDragStart: function onDragStart(e) {
                _this2.onDragStart(e);
              },
              onDragLeave: function onDragLeave(e) {
                _this2.onDragLeave(e);
              },
              onDragOver: function onDragOver(e) {
                _this2.onDragOver(e);
              },
              onDrop: function onDrop(e) {
                _this2.onDrop(e);
              },
              title: this.props.node.title },
            this.props.renderNodeToggle(this.props.node, function () {
              _this2.onClickToggle();
            }),
            this.props.renderNodeTitle(this.props.node),
            this.renderActions(),
            _react2.default.createElement(_reactBootstrap.Clearfix, null)
          ),
          this.renderChildren()
        );
      } else {
        return _react2.default.createElement(
          'div',
          {
            style: this.props.style,
            'data-id': this.props.node.id,
            className: 'react-tree-node-container',
            key: this.props.node.id },
          _react2.default.createElement(
            'div',
            {
              active: this.props.node.active ? 'active' : 'false',
              className: 'react-tree-node-header',
              style: headerStyle,
              title: this.props.node.title },
            this.props.renderNodeToggle(this.props.node, function () {
              _this2.onClickToggle();
            }),
            this.props.renderNodeTitle(this.props.node),
            this.renderActions(),
            _react2.default.createElement(_reactBootstrap.Clearfix, null)
          ),
          this.renderChildren()
        );
      }
    }
  }, {
    key: 'onDragLeave',
    value: function onDragLeave(e) {
      this.setState({ dragPosition: undefined });
    }
  }, {
    key: 'onDrop',
    value: function onDrop(e) {
      var pos = this.state.dragPosition;
      var rank = this.props.node.rank;
      if (pos === 'below') {
        rank++;
      }
      var data = e.dataTransfer.getData('text/plain');
      // console.log(data)
      var obj = JSON.parse(data);
      // console.log(obj)

      this.props.onDropNode(obj, this.props.parentId, rank);

      this.setState({ dragPosition: undefined });
    }
  }, {
    key: 'onClickToggle',
    value: function onClickToggle() {
      this.props.onToggleClick(this.props.node);
    }
  }, {
    key: 'onDragStart',
    value: function onDragStart(e) {
      // console.log('dragging')
      this.props.node.open = false;
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', JSON.stringify(this.props.node));
      this.forceUpdate();
    }
  }, {
    key: 'onDragOver',
    value: function onDragOver(e) {
      e.preventDefault();
      e.dataTransfer.effectAllowed = 'move';
      var header = findAncestor(e.target, 'react-tree-node-header');
      if (header) {
        var rect = header.getBoundingClientRect();

        if (header.parentNode.childNodes.length === 2) {
          var qH = rect.height / 5.0;

          if (e.pageY <= rect.top + 2.0 * qH) {
            this.setState({ dragPosition: 'above' });
          } else if (e.pageY <= rect.top + 3 * qH) {
            this.setState({ dragPosition: 'child' });
          } else {
            this.setState({ dragPosition: 'below' });
          }
        } else {
          var _qH = rect.height / 2.0;

          if (e.pageY <= rect.top + _qH) {
            this.setState({ dragPosition: 'above' });
          } else {
            this.setState({ dragPosition: 'below' });
          }
        }

        this.forceUpdate();
      }
    }
  }, {
    key: 'renderChildren',
    value: function renderChildren() {
      if (this.props.node.children !== undefined && this.props.node.children instanceof Array && this.props.node.open) {
        this.props.node.children.sort(this.props.sortFunc);

        var children = [];
        for (var i = 0; i < this.props.node.children.length; i++) {
          children.push(_react2.default.createElement(NodeContainer, { style: this.props.style,
            parentId: this.props.node.id,
            tree: this.props.tree,
            isEditable: this.props.isEditable,
            key: this.props.node.children[i].id,
            sortFunc: this.props.sortFunc,
            onDropNode: this.props.onDropNode,
            onNodeClick: this.props.onNodeClick,
            renderNodeToggle: this.props.renderNodeToggle,
            renderNodeAction: this.props.renderNodeAction,
            renderNodeTitle: this.props.renderNodeTitle,
            onToggleClick: this.props.onToggleClick,
            node: this.props.node.children[i] }));
        }
        return _react2.default.createElement(
          'div',
          { className: 'react-tree-node-children' },
          children
        );
      }
    }
  }, {
    key: 'renderActions',
    value: function renderActions() {
      if (this.props.node.actions !== undefined && this.props.node.actions instanceof Array) {
        var actions = [];
        for (var i = 0; i < this.props.node.actions.length; i++) {
          actions.push(this.props.renderNodeAction(this.props.node, this.props.node.actions[i]));
        }
        return _react2.default.createElement(
          'div',
          { className: 'react-tree-node-actions' },
          actions
        );
      }
    }
  }]);

  return NodeContainer;
}(_react2.default.Component);

NodeContainer.propTypes = {
  renderNodeToggle: _react2.default.PropTypes.func.isRequired,
  renderNodeTitle: _react2.default.PropTypes.func.isRequired,
  tree: _react2.default.PropTypes.element.isRequired,
  hidden: _react2.default.PropTypes.bool,
  renderNodeAction: _react2.default.PropTypes.func.isRequired,
  onNodeClick: _react2.default.PropTypes.func,
  parentId: _react2.default.PropTypes.string,
  sortFunc: _react2.default.PropTypes.func.isRequired,
  isEditable: _react2.default.PropTypes.bool,
  onToggleClick: _react2.default.PropTypes.func,
  node: _react2.default.PropTypes.object.isRequired,
  onDropNode: _react2.default.PropTypes.func.isRequired,
  style: _react2.default.PropTypes.object
};