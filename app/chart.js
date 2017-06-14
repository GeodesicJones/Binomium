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
      return React.createElement("canvas", { id: this.props.id, height: this.props.height, width: this.props.width });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.canvas = document.getElementById(this.props.id);
      this.chart = {
        width: this.props.width,
        height: this.props.height,
        padding: 15
      };

      this.vAxis = {};
      this.vAxis.padding = 5;
      this.vAxis.textWidth = 20;
      this.vAxis.width = this.vAxis.padding + this.vAxis.textWidth;

      this.hAxis = {};
      this.hAxis.padding = 3;
      this.hAxis.textHeight = 15;
      this.hAxis.height = this.hAxis.padding + this.hAxis.textHeight;

      this.chartArea = {};
      this.chartArea.x = this.chart.padding + this.vAxis.width;
      this.chartArea.y = this.chart.height - this.chart.padding - this.hAxis.height;
      this.chartArea.width = this.chart.width - this.chart.padding - this.chartArea.x;
      this.chartArea.height = this.chartArea.y - this.chart.padding;

      var draw = new AnimationDraw(this.props.id);
      this.build = new AnimationBuild();
      var build = this.build;
      this.buildBorderAnimation(build);
      draw.animate(build.frames);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(nextProps, nextState) {
      var build = new AnimationBuild();
      build.clear(1, 1, this.chart.width - 2, this.chart.height - 2);
      this.buildAxisAnimation(build);
      this.buildSeriesAnimation(build, this.props.series, this.props.labels.length);

      if (!this.draw) this.draw = new AnimationDraw(this.props.id);
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
      var delta = 30;
      build.line({ x: 0, y: 0 }, { x: this.chart.width, y: 0 }, delta);
      build.line({ x: this.chart.width, y: 0 }, { x: this.chart.width, y: this.chart.height }, delta);
      build.line({ x: this.chart.width, y: this.chart.height }, { x: 0, y: this.chart.height }, delta);
      build.line({ x: 0, y: this.chart.height }, { x: 0, y: 0 }, delta);
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
      var verticalScalingFactor = this.chartArea.height / series.max;

      for (var _i = 0; _i < series.data.length; _i++) {
        var index = series.data[_i].index;
        var value = series.data[_i].value * verticalScalingFactor;
        var spacing = (this.chartArea.width - 2 * this.chart.padding) / columnCount;
        build.column(this.columnWidth, value, {
          x: this.chartArea.x + this.chart.padding + index * spacing,
          y: this.chartArea.y - 1
        });
      }
    }
  }, {
    key: "buildAxisAnimation",
    value: function buildAxisAnimation(build) {
      // draw horizontal axis
      var delta = 10;
      build.line({ x: this.chartArea.x, y: this.chartArea.y }, { x: this.chartArea.x + this.chartArea.width, y: this.chartArea.y }, delta);

      // add labels to horizontal axis
      var skipFactor = 1 + Math.floor(this.props.labels.length / 10);
      var unskippedLables = [];
      for (var i = 0; i < this.props.labels.length; i += skipFactor) {
        unskippedLables.push(this.props.labels[i]);
      }

      var hSpacing = skipFactor * (this.chartArea.width - 2 * this.chart.padding) / this.props.labels.length;
      build.text(unskippedLables, {
        x: this.chartArea.x + this.chart.padding + this.columnWidth / 2,
        y: this.chartArea.y + this.hAxis.padding + this.hAxis.textHeight
      }, hSpacing);

      // add vertical axis
      build.line({ x: this.chartArea.x, y: this.chartArea.y }, { x: this.chartArea.x, y: this.chart.padding }, delta);

      // add labels to vertical axis

      var vSpacing = this.chartArea.height / 4;
      var series = this.props.series;
      build.text(["", Math.round(series.max / 4), Math.round(series.max / 2), Math.round(series.max / 4), series.max], {
        x: this.chartArea.x - this.vAxis.width / 2,
        y: this.chartArea.y + this.hAxis.textHeight / 2
      }, vSpacing, "vertical");
    }
  }, {
    key: "columnWidth",
    get: function get() {
      return this.chart.width / 2 / this.props.labels.length;
    }
  }]);

  return Chart;
}(React.Component);