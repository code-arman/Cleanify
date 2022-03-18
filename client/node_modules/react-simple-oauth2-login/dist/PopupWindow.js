"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _utils = require("./utils");

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var PopupWindow = /*#__PURE__*/function () {
  function PopupWindow(id, url) {
    var popupOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var otherOptions = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    _classCallCheck(this, PopupWindow);

    this.id = id;
    this.url = url;
    this.popupOptions = popupOptions;
    this.locationKey = otherOptions.locationKey;
    this.isCrossOrigin = otherOptions.isCrossOrigin;
    this.response = null;
    this.handlePostMessage = this.handlePostMessage.bind(this);
  }

  _createClass(PopupWindow, [{
    key: "handlePostMessage",
    value: function handlePostMessage(event) {
      if (event.data.message === 'deliverResult') {
        this.response = event.data.result;
      }
    }
  }, {
    key: "open",
    value: function open() {
      var url = this.url,
          id = this.id,
          popupOptions = this.popupOptions,
          isCrossOrigin = this.isCrossOrigin;

      if (isCrossOrigin) {
        window.addEventListener('message', this.handlePostMessage);
      }

      this.window = window.open(url, id, (0, _utils.toQuery)(popupOptions, ','));
    }
  }, {
    key: "close",
    value: function close() {
      this.cancel();
      this.window.close();
      window.removeEventListener('message', this.handlePostMessage);
    }
  }, {
    key: "poll",
    value: function poll() {
      var _this = this;

      this.promise = new Promise(function (resolve, reject) {
        _this.iid = window.setInterval(function () {
          try {
            var popup = _this.window;

            if (!popup || popup.closed !== false) {
              _this.close();

              reject(new Error('The popup was closed for an unexpected reason'));
              return;
            } // Cross origin auth flows need to be handled differently


            if (_this.isCrossOrigin) {
              if (_this.response) {
                resolve(_this.response);

                _this.close();
              } else {
                popup.postMessage({
                  message: 'requestResult'
                }, '*');
                return;
              }
            } else {
              if (popup.location.href === _this.url || popup.location.pathname === 'blank') {
                // location unchanged, still polling
                return;
              }

              if (!['search', 'hash'].includes(_this.locationKey)) {
                reject(new Error("Cannot get data from location.".concat(_this.locationKey, ", check the responseType prop")));

                _this.close();

                return;
              }

              var locationValue = popup.location[_this.locationKey];
              var params = (0, _utils.toParams)(locationValue);
              resolve(params);

              _this.close();
            }
          } catch (error) {
            // Log the error to the console but remain silent
            if (error.name === 'SecurityError' && error.message.includes('Blocked a frame with origin')) {
              console.warn('Encountered a cross-origin error, is your authorization URL on a different server? Use the "isCrossOrigin" property, see documentation for details.');
            } else {
              console.error(error);
            }
          }
        }, 500);
      });
    }
  }, {
    key: "cancel",
    value: function cancel() {
      if (this.iid) {
        window.clearInterval(this.iid);
        this.iid = null;
      }
    }
  }, {
    key: "then",
    value: function then() {
      var _this$promise;

      return (_this$promise = this.promise).then.apply(_this$promise, arguments);
    }
  }, {
    key: "catch",
    value: function _catch() {
      var _this$promise2;

      return (_this$promise2 = this.promise)["catch"].apply(_this$promise2, arguments);
    }
  }], [{
    key: "open",
    value: function open() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var popup = _construct(this, args);

      popup.open();
      popup.poll();
      return popup;
    }
  }]);

  return PopupWindow;
}();

var _default = PopupWindow;
exports["default"] = _default;