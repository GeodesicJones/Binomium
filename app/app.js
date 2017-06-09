"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_React$Component) {
  _inherits(App, _React$Component);

  function App(props) {
    _classCallCheck(this, App);

    var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

    _this.state = { n: 8, p: 0.5, numObservations: 400 };
    _this.onClick = _this.onClick.bind(_this);
    _this.onBlurN = _this.onBlurN.bind(_this);
    _this.onBlurP = _this.onBlurP.bind(_this);
    _this.onBlurNumObservations = _this.onBlurNumObservations.bind(_this);
    _this.getObservation = _this.getObservation.bind(_this);
    return _this;
  }

  _createClass(App, [{
    key: "onClick",
    value: function onClick() {
      var p = this.state.p;
      var n = this.state.n;
      var count = this.state.numObservations;
      var values = [];
      var labels = [];

      for (var i = 0; i <= n; i++) {
        labels.push(i);
      }

      for (var _i = 0; _i < count; _i++) {
        values.push(0);
      }

      var series = {
        data: []
      };

      for (var _i2 = 0; _i2 < count; _i2++) {
        var observation = this.getObservation(n, p);
        values[observation]++;
        series.data.push({ index: observation, value: values[observation] });
      }

      this.setState({ series: series, labels: labels });
    }
  }, {
    key: "getObservation",
    value: function getObservation(n, p) {
      var result = 0;
      for (var i = 0; i < n; i++) {
        if (Math.random() <= p) {
          result++;
        }
      }
      return result;
    }
  }, {
    key: "onBlurN",
    value: function onBlurN(event) {
      this.setState({ n: event.target.value });
    }
  }, {
    key: "onBlurP",
    value: function onBlurP(event) {
      this.setState({ p: event.target.value });
    }
  }, {
    key: "onBlurNumObservations",
    value: function onBlurNumObservations(event) {
      this.setState({ numObservations: event.target.value });
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement(
          "h1",
          null,
          "Welcome to The Binomium"
        ),
        React.createElement(
          "div",
          { id: "interactive" },
          React.createElement(Chart, {
            width: 450,
            height: 450,
            id: "chart",
            padding: 15,
            series: this.state.series,
            labels: this.state.labels
          }),
          React.createElement(
            "div",
            { id: "controls" },
            React.createElement(
              "div",
              null,
              "n:",
              " ",
              React.createElement("input", {
                type: "text",
                defaultValue: this.state.n,
                onChange: this.onBlurN
              })
            ),
            React.createElement(
              "div",
              null,
              "p:",
              " ",
              React.createElement("input", {
                type: "text",
                defaultValue: this.state.p,
                onChange: this.onBlurP
              })
            ),
            React.createElement(
              "div",
              null,
              "#: ",
              " ",
              React.createElement("input", {
                type: "text",
                defaultValue: this.state.numObservations,
                onChange: this.onBlurNumObservations
              })
            ),
            React.createElement("input", { type: "button", onClick: this.onClick, value: "Make It So" })
          )
        ),
        React.createElement(
          "div",
          { id: "description" },
          "The Binomium is a playground for exploring binomial distributions. Right now it's pretty simple: it simulates tossing a handful of coins and counting how many land heads up.",
          React.createElement("p", null),
          "To operate, fill in the inputs:",
          React.createElement(
            "ul",
            null,
            React.createElement(
              "li",
              null,
              "n: the number of coins to toss"
            ),
            React.createElement(
              "li",
              null,
              "p: the probability each coin will land heads up (these coins aren't always fair)"
            ),
            React.createElement(
              "li",
              null,
              "#: the number of times to toss the whole handful"
            )
          ),
          "Then click 'Make It So', and it will.",
          React.createElement("p", null),
          "What's interesting is how a series of random events approximates a non-random shape. In my mind, it's a very simple example of emergent phenomana."
        )
      );
    }
  }]);

  return App;
}(React.Component);

var component = ReactDOM.render(React.createElement(App, null), document.getElementById("app"));