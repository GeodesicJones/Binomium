class AnimationBuild {
  constructor(delta) {
    this.frames = [];
    this.delta = delta;
    this.line = this.line.bind(this);
    this.isMoreLine = this.isMoreLine.bind(this);
  }

  isMoreLine(start, end, current) {
    return (start < end && current < end) || (start > end && current > end);
  }

  line(start, end) {
    let x = start.x;
    let y = start.y;
    let xDelta = start.x < end.x ? this.delta : -this.delta;
    let yDelta = start.y < end.y ? this.delta : -this.delta;

    while (x != end.x || y != end.y) {
      let nextX = this.isMoreLine(start.x, end.x, x) ? x + xDelta : end.x;
      let nextY = this.isMoreLine(start.y, end.y, y) ? y + yDelta : end.y;
      this.frames.push({
        type: "line",
        start: { x: x, y: y },
        end: { x: nextX, y: nextY }
      });
      x = nextX;
      y = nextY;
    }
  }

  text(txt, start, spacing) {
    // TODO: separate out call to context
    let ctx = document.getElementById("chart").getContext("2d");
    let x = start.x;
    let y = start.y;
    for (let i = 0; i < txt.length; i++) {
      let textWidth = ctx.measureText(txt[i]).width;
      this.frames.push({
        type: "text",
        location: { x: x - textWidth/2, y: y },
        text: txt[i]
      });
      x += spacing;
    }
  }

  column(width, height, location) {
    this.frames.push({
      type: "column",
      width: width,
      height: height,
      location: location
    });
  }

  clear(x, y, width, height) {
    this.frames.push({
      type: "clear",
      x: x,
      y: y,
      width: width,
      height: height
    });
  }
}

class AnimationDraw {
  constructor(canvasId) {
    this.ctx = document.getElementById(canvasId).getContext("2d");
    this.drawFrame = this.drawFrame.bind(this);
  }
  drawLine(start, end) {
    this.ctx.beginPath();
    this.ctx.moveTo(start.x, start.y);
    this.ctx.lineTo(end.x, end.y);
    this.ctx.stroke();
  }
  drawText(text, location) {
    this.ctx.fillText(text, location.x, location.y);
  }
  drawColumn(width, height, location) {
    this.ctx.fillRect(location.x, location.y, width, -height);
  }
  clear(x, y, width, height) {
    this.ctx.clearRect(x, y, width, height);
  }
  animate(frames) {
    this.frames = frames;
    this.frameIndex = 0;
    this.cancel = false;
    window.requestAnimationFrame(this.drawFrame);
  }
  cancelCurrentAnimation(){
    this.cancel = true;
  }
  drawFrame() {
    if (this.frameIndex < this.frames.length && !this.cancel) {
      let frameContent = this.frames[this.frameIndex];
      switch (frameContent.type) {
        case "line":
          this.drawLine(frameContent.start, frameContent.end);
          break;
        case "text":
          this.drawText(frameContent.text, frameContent.location);
          break;
        case "column":
          this.drawColumn(
            frameContent.width,
            frameContent.height,
            frameContent.location
          );
          break;
        case "clear":
          this.clear(
            frameContent.x,
            frameContent.y,
            frameContent.width,
            frameContent.height
          );
          break;
      }
      this.frameIndex++;
      window.requestAnimationFrame(this.drawFrame);
    }
  }
}
