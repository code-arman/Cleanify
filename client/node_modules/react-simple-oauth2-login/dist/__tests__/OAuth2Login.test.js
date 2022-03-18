"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _react = _interopRequireDefault(require("react"));

var _reactTestRenderer = _interopRequireDefault(require("react-test-renderer"));

var _enzymeAdapterReact = _interopRequireDefault(require("enzyme-adapter-react-16"));

var _enzyme = _interopRequireWildcard(require("enzyme"));

var _OAuth2Login = _interopRequireDefault(require("../OAuth2Login"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_enzyme["default"].configure({
  adapter: new _enzymeAdapterReact["default"]()
});

var authorizationUrl = 'https://foo.test/authorize';

var onSuccess = function onSuccess() {};

var onFailure = function onFailure() {}; // lazy way to circumvent jsdom's `Error: Not implemented: window.open`


window.open = function () {};

test('Renders defaults', function () {
  var component = _reactTestRenderer["default"].create( /*#__PURE__*/_react["default"].createElement(_OAuth2Login["default"], {
    onSuccess: onSuccess,
    onFailure: onFailure,
    authorizationUrl: authorizationUrl,
    clientId: "foo",
    redirectUri: "http://foo.test/auth/OAuth2",
    responseType: "code"
  }));

  var tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
test('Renders with `className`', function () {
  var component = _reactTestRenderer["default"].create( /*#__PURE__*/_react["default"].createElement(_OAuth2Login["default"], {
    onSuccess: onSuccess,
    onFailure: onFailure,
    authorizationUrl: authorizationUrl,
    clientId: "foo",
    redirectUri: "http://foo.test/auth/OAuth2",
    responseType: "code",
    className: "foobar"
  }));

  var tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
test('Renders with `buttonText`', function () {
  var component = _reactTestRenderer["default"].create( /*#__PURE__*/_react["default"].createElement(_OAuth2Login["default"], {
    onSuccess: onSuccess,
    onFailure: onFailure,
    authorizationUrl: authorizationUrl,
    clientId: "foo",
    redirectUri: "http://foo.test/auth/OAuth2",
    responseType: "code",
    buttonText: "Foo"
  }));

  var tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
test('Renders with custom render function', function () {
  var component = _reactTestRenderer["default"].create( /*#__PURE__*/_react["default"].createElement(_OAuth2Login["default"], {
    onSuccess: onSuccess,
    onFailure: onFailure,
    authorizationUrl: authorizationUrl,
    clientId: "foo",
    redirectUri: "http://foo.test/auth/OAuth2",
    responseType: "code",
    render: function render(renderProps) {
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: renderProps.className
      }, /*#__PURE__*/_react["default"].createElement("a", {
        href: true,
        onClick: renderProps.onClick
      }, renderProps.buttonText));
    }
  }));

  var tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
test('Opens OAuth dialog', function () {
  var clientId = 'foo';
  var redirectUri = 'http://foo.test/auth/OAuth2';

  var component = /*#__PURE__*/_react["default"].createElement(_OAuth2Login["default"], {
    onSuccess: onSuccess,
    onFailure: onFailure,
    authorizationUrl: authorizationUrl,
    clientId: clientId,
    redirectUri: redirectUri,
    responseType: "code",
    scope: "scope1 scope2"
  });

  var wrapper = (0, _enzyme.shallow)(component);
  wrapper.find('button').simulate('click');
  var query = "client_id=".concat(clientId, "&scope=scope1 scope2&redirect_uri=").concat(redirectUri, "&response_type=code");
  expect(wrapper.instance().popup.url).toBe("https://foo.test/authorize?".concat(query));
});