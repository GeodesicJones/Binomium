"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
      var maxColumnHeight = 0;
      for (var i = 0; i < series.data.length; i++) {
        if (series.data[i].value > maxColumnHeight) {
          maxColumnHeight = series.data[i].value;
        }
      }
      var verticalScalingFactor = .8 * this.props.height / maxColumnHeight;

      for (var _i = 0; _i < series.data.length; _i++) {
        var index = series.data[_i].index;
        var value = series.data[_i].value * verticalScalingFactor;
        var fullAxisWidth = this.props.width - this.props.padding;
        var axisHeight = this.props.height - 2 * this.props.padding;
        var spacing = (fullAxisWidth - 2 * this.props.padding) / columnCount;
        var x = 2 * this.props.padding + index * spacing;
        var y = axisHeight - 1;
        build.column(this.columnWidth, value, { x: x, y: y });
      }
    }
  }, {
    key: "buildAxisAnimation",
    value: function buildAxisAnimation(build, labels) {
      var fullAxisWidth = this.props.width - this.props.padding;
      var axisHeight = this.props.height - 2 * this.props.padding;
      build.line({ x: this.props.padding, y: axisHeight }, { x: fullAxisWidth, y: axisHeight });

      var skipFactor = 1 + Math.floor(labels.length / 10);
      var unskippedLables = [];
      for (var i = 0; i < labels.length; i += skipFactor) {
        unskippedLables.push(labels[i]);
      }

      var spacing = skipFactor * (fullAxisWidth - 2 * this.props.padding) / labels.length;
      build.text(unskippedLables, {
        x: 2 * this.props.padding + this.columnWidth / 2,
        y: this.props.height - this.props.padding
      }, spacing);
    }
  }, {
    key: "columnWidth",
    get: function get() {
      return this.props.width / 2 / this.props.labels.length;
    }
  }]);

  return Chart;
}(React.Component);