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
    let x = start.x;
    var y = start.y;
    for (let i = 0; i < txt.length; i++) {
      this.frames.push({
        type: "text",
        location: { x: x, y: y },
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

class Chart extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <canvas
        width={this.props.width}
        height={this.props.height}
        id={this.props.id}
      />
    );
  }
  componentDidMount() {
    this.draw = new AnimationDraw(this.props.id);
    let build = new AnimationBuild(10);
    this.buildBorderAnimation(build);
    this.draw.animate(build.frames);
  }

  componentDidUpdate(nextProps, nextState) {
    let build = new AnimationBuild(10);
    build.clear(1, 1, this.props.width - 2, this.props.height - 2);
    this.buildAxisAnimation(build, this.props.labels);
    this.buildSeriesAnimation(build, this.props.series, this.props.labels.length);
    this.draw.cancelCurrentAnimation();
    this.draw.animate(build.frames);
  }

  shouldComponentUpdate(nextProps, nextState){
    return nextProps.series != this.props.series;
  }

  buildBorderAnimation(build) {
    build.line({ x: 0, y: 0 }, { x: this.props.width, y: 0 });
    build.line(
      { x: this.props.width, y: 0 },
      { x: this.props.width, y: this.props.height }
    );
    build.line(
      { x: this.props.width, y: this.props.height },
      { x: 0, y: this.props.height }
    );
    build.line({ x: 0, y: this.props.height }, { x: 0, y: 0 });
  }
  buildSeriesAnimation(build, series, columnCount) {
    for (let i = 0; i < series.data.length; i++) {
      let index = series.data[i].index;
      let value = series.data[i].value;
      let finalAxisWidth = this.props.width - this.props.padding;
      let axisHeight = this.props.height - 2 * this.props.padding;
      let spacing = (finalAxisWidth - this.props.padding) / columnCount;
      let x = 2 * this.props.padding + index * spacing - 3;
      let y = axisHeight - 1;
      build.column(series.columnWidth, value, { x: x, y: y });
    }
  }
  buildAxisAnimation(build, labels) {
    var finalAxisWidth = this.props.width - this.props.padding;
    var axisHeight = this.props.height - 2 * this.props.padding;
    build.line(
      { x: this.props.padding, y: axisHeight },
      { x: finalAxisWidth, y: axisHeight }
    );
    var spacing = (finalAxisWidth - this.props.padding) / labels.length;
    build.text(
      labels,
      {
        x: 2 * this.props.padding,
        y: this.props.height - this.props.padding
      },
      spacing
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { n: 8, p: 0.5, data: [], labels: "" };
    this.onClick = this.onClick.bind(this);
    this.onBlurN = this.onBlurN.bind(this);
    this.onBlurP = this.onBlurP.bind(this);
    this.getObservation = this.getObservation.bind(this);
  }

  onClick() {
    let p = this.state.p;
    let n = this.state.n;
    let count = 700;
    let values = [];
    let labels = "";

    for (let i = 0; i <= n; i++) {
      labels += i;
    }

    for (let i = 0; i < count; i++) {
      values.push(0);
    }

    let series = {
      columnWidth: 10,
      data: []
    };

    for (let i = 0; i < count; i++) {
      let observation = this.getObservation(n, p);
      values[observation]++;
      series.data.push({ index: observation, value: values[observation] });
    }

    this.setState({ series: series, labels: labels });
  }

  getObservation(n, p) {
    let result = 0;
    for (let i = 0; i < n; i++) {
      if (Math.random() <= p) {
        result++;
      }
    }
    return result;
  }
  onBlurN(event) {
    this.setState({ n: event.target.value });
  }
  onBlurP(event) {
    this.setState({ p: event.target.value });
  }

  render() {
    return (
      <div>
        <Chart
          width={250}
          height={250}
          id="chart"
          padding={15}
          series={this.state.series}
          labels={this.state.labels}
        />
        <br />
        n:{" "}
        <input
          type="text"
          defaultValue={this.state.n}
          onChange={this.onBlurN}
        />
        <br />
        p:{" "}
        <input
          type="text"
          defaultValue={this.state.p}
          onChange={this.onBlurP}
        />
        <br />
        <input type="button" onClick={this.onClick} value="Go" />
      </div>
    );
  }
}

let component = ReactDOM.render(<App />, document.getElementById("app"));
