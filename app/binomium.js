"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AnimationBuild = function () {
  function AnimationBuild(delta) {
    _classCallCheck(this, AnimationBuild);

    this.frames = [];
    this.delta = delta;
    this.line = this.line.bind(this);
    this.isMoreLine = this.isMoreLine.bind(this);
  }

  _createClass(AnimationBuild, [{
    key: "isMoreLine",
    value: function isMoreLine(start, end, current) {
      return start < end && current < end || start > end && current > end;
    }
  }, {
    key: "line",
    value: function line(start, end) {
      var x = start.x;
      var y = start.y;
      var xDelta = start.x < end.x ? this.delta : -this.delta;
      var yDelta = start.y < end.y ? this.delta : -this.delta;

      while (x != end.x || y != end.y) {
        var nextX = this.isMoreLine(start.x, end.x, x) ? x + xDelta : end.x;
        var nextY = this.isMoreLine(start.y, end.y, y) ? y + yDelta : end.y;
        this.frames.push({
          type: "line",
          start: { x: x, y: y },
          end: { x: nextX, y: nextY }
        });
        x = nextX;
        y = nextY;
      }
    }
  }, {
    key: "text",
    value: function text(txt, start, spacing) {
      var x = start.x;
      var y = start.y;
      for (var i = 0; i < txt.length; i++) {
        this.frames.push({
          type: "text",
          location: { x: x, y: y },
          text: txt[i]
        });
        x += spacing;
      }
    }
  }, {
    key: "column",
    value: function column(width, height, location) {
      this.frames.push({
        type: "column",
        width: width,
        height: height,
        location: location
      });
    }
  }, {
    key: "clear",
    value: function clear(x, y, width, height) {
      this.frames.push({
        type: "clear",
        x: x,
        y: y,
        width: width,
        height: height
      });
    }
  }]);

  return AnimationBuild;
}();

var AnimationDraw = function () {
  function AnimationDraw(canvasId) {
    _classCallCheck(this, AnimationDraw);

    this.ctx = document.getElementById(canvasId).getContext("2d");
    this.drawFrame = this.drawFrame.bind(this);
  }

  _createClass(AnimationDraw, [{
    key: "drawLine",
    value: function drawLine(start, end) {
      this.ctx.beginPath();
      this.ctx.moveTo(start.x, start.y);
      this.ctx.lineTo(end.x, end.y);
      this.ctx.stroke();
    }
  }, {
    key: "drawText",
    value: function drawText(text, location) {
      this.ctx.fillText(text, location.x, location.y);
    }
  }, {
    key: "drawColumn",
    value: function drawColumn(width, height, location) {
      this.ctx.fillRect(location.x, location.y, width, -height);
    }
  }, {
    key: "clear",
    value: function clear(x, y, width, height) {
      this.ctx.clearRect(x, y, width, height);
    }
  }, {
    key: "animate",
    value: function animate(frames) {
      this.frames = frames;
      this.frameIndex = 0;
      this.cancel = false;
      window.requestAnimationFrame(this.drawFrame);
    }
  }, {
    key: "cancelCurrentAnimation",
    value: function cancelCurrentAnimation() {
      this.cancel = true;
    }
  }, {
    key: "drawFrame",
    value: function drawFrame() {
      if (this.frameIndex < this.frames.length && !this.cancel) {
        var frameContent = this.frames[this.frameIndex];
        switch (frameContent.type) {
          case "line":
            this.drawLine(frameContent.start, frameContent.end);
            break;
          case "text":
            this.drawText(frameContent.text, frameContent.location);
            break;
          case "column":
            this.drawColumn(frameContent.width, frameContent.height, frameContent.location);
            break;
          case "clear":
            this.clear(frameContent.x, frameContent.y, frameContent.width, frameContent.height);
            break;
        }
        this.frameIndex++;
        window.requestAnimationFrame(this.drawFrame);
      }
    }
  }]);

  return AnimationDraw;
}();

var Chart = function (_React$Component) {
  _inherits(Chart, _React$Component);

  function Chart(props) {
    _classCallCheck(this, Chart);

    return _possibleConstructorReturn(this, (Chart.__proto__ || Object.getPrototypeOf(Chart)).call(this, props));
  }

  _createClass(Chart, [{
    key: "render",
    value: function render() {
      return React.createElement("canvas", {
        width: this.props.width,
        height: this.props.height,
        id: this.props.id
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.draw = new AnimationDraw(this.props.id);
      var build = new AnimationBuild(10);
      this.buildBorderAnimation(build);
      this.draw.animate(build.frames);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(nextProps, nextState) {
      var build = new AnimationBuild(10);
      build.clear(1, 1, this.props.width - 2, this.props.height - 2);
      this.buildAxisAnimation(build, this.props.labels);
      this.buildSeriesAnimation(build, this.props.series, this.props.labels.length);
      this.draw.cancelCurrentAnimation();
      this.draw.animate(build.frames);
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      return nextProps.series != this.props.series;
    }
  }, {
    key: "buildBorderAnimation",
    value: function buildBorderAnimation(build) {
      build.line({ x: 0, y: 0 }, { x: this.props.width, y: 0 });
      build.line({ x: this.props.width, y: 0 }, { x: this.props.width, y: this.props.height });
      build.line({ x: this.props.width, y: this.props.height }, { x: 0, y: this.props.height });
      build.line({ x: 0, y: this.props.height }, { x: 0, y: 0 });
    }
  }, {
    key: "buildSeriesAnimation",
    value: function buildSeriesAnimation(build, series, columnCount) {
      for (var i = 0; i < series.data.length; i++) {
        var index = series.data[i].index;
        var value = series.data[i].value;
        var finalAxisWidth = this.props.width - this.props.padding;
        var axisHeight = this.props.height - 2 * this.props.padding;
        var spacing = (finalAxisWidth - this.props.padding) / columnCount;
        var x = 2 * this.props.padding + index * spacing - 3;
        var y = axisHeight - 1;
        build.column(series.columnWidth, value, { x: x, y: y });
      }
    }
  }, {
    key: "buildAxisAnimation",
    value: function buildAxisAnimation(build, labels) {
      var finalAxisWidth = this.props.width - this.props.padding;
      var axisHeight = this.props.height - 2 * this.props.padding;
      build.line({ x: this.props.padding, y: axisHeight }, { x: finalAxisWidth, y: axisHeight });
      var spacing = (finalAxisWidth - this.props.padding) / labels.length;
      build.text(labels, {
        x: 2 * this.props.padding,
        y: this.props.height - this.props.padding
      }, spacing);
    }
  }]);

  return Chart;
}(React.Component);

var App = function (_React$Component2) {
  _inherits(App, _React$Component2);

  function App(props) {
    _classCallCheck(this, App);

    var _this2 = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

    _this2.state = { n: 8, p: 0.5, data: [], labels: "" };
    _this2.onClick = _this2.onClick.bind(_this2);
    _this2.onBlurN = _this2.onBlurN.bind(_this2);
    _this2.onBlurP = _this2.onBlurP.bind(_this2);
    _this2.getObservation = _this2.getObservation.bind(_this2);
    return _this2;
  }

  _createClass(App, [{
    key: "onClick",
    value: function onClick() {
      var p = this.state.p;
      var n = this.state.n;
      var count = 700;
      var values = [];
      var labels = "";

      for (var i = 0; i <= n; i++) {
        labels += i;
      }

      for (var _i = 0; _i < count; _i++) {
        values.push(0);
      }

      var series = {
        columnWidth: 10,
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
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement(Chart, {
          width: 250,
          height: 250,
          id: "chart",
          padding: 15,
          series: this.state.series,
          labels: this.state.labels
        }),
        React.createElement("br", null),
        "n:",
        " ",
        React.createElement("input", {
          type: "text",
          defaultValue: this.state.n,
          onChange: this.onBlurN
        }),
        React.createElement("br", null),
        "p:",
        " ",
        React.createElement("input", {
          type: "text",
          defaultValue: this.state.p,
          onChange: this.onBlurP
        }),
        React.createElement("br", null),
        React.createElement("input", { type: "button", onClick: this.onClick, value: "Go" })
      );
    }
  }]);

  return App;
}(React.Component);

var component = ReactDOM.render(React.createElement(App, null), document.getElementById("app"));