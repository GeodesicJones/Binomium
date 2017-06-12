"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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
        var nextX = this.isMoreLine(start.x, end.x, x + xDelta) ? x + xDelta : end.x;
        var nextY = this.isMoreLine(start.y, end.y, y + yDelta) ? y + yDelta : end.y;
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
      this.ctx.strokeStyle = "gray";
      this.ctx.beginPath();
      this.ctx.moveTo(start.x, start.y);
      this.ctx.lineTo(end.x, end.y);
      this.ctx.stroke();
    }
  }, {
    key: "drawText",
    value: function drawText(text, location) {
      this.ctx.fillStyle = "black";
      // center text horizontally
      var measure = this.ctx.measureText(text);
      this.ctx.fillText(text, location.x - measure.width / 2, location.y);
    }
  }, {
    key: "drawColumn",
    value: function drawColumn(width, height, location) {
      this.ctx.fillStyle = "deepskyblue";
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