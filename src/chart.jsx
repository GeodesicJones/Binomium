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

  get columnWidth(){
    return this.props.width/2/this.props.labels.length;
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
    let maxColumnHeight = 0;
    for (let i = 0; i < series.data.length; i++) {
      if(series.data[i].value > maxColumnHeight){
        maxColumnHeight  = series.data[i].value;
      }
    }
    let verticalScalingFactor =  .8 * this.props.height / maxColumnHeight;

    for (let i = 0; i < series.data.length; i++) {
      let index = series.data[i].index;
      let value = series.data[i].value *  verticalScalingFactor;
      let fullAxisWidth = this.props.width - this.props.padding;
      let axisHeight = this.props.height - 2 * this.props.padding;
      let spacing = (fullAxisWidth - 2*this.props.padding) / columnCount;
      let x = 2 * this.props.padding + index * spacing;
      let y = axisHeight - 1;
      build.column(this.columnWidth, value, { x: x, y: y });
    }
  }
  buildAxisAnimation(build, labels) {
    let fullAxisWidth = this.props.width - this.props.padding;
    let axisHeight = this.props.height - 2 * this.props.padding;
    build.line(
      { x: this.props.padding, y: axisHeight },
      { x: fullAxisWidth, y: axisHeight }
    );

    let skipFactor = 1 + Math.floor(labels.length/10);
    let unskippedLables = [];
    for(let i = 0; i < labels.length; i += skipFactor){
      unskippedLables.push(labels[i]);
    }

    let spacing = skipFactor * (fullAxisWidth - 2*this.props.padding) / labels.length;
    build.text(
      unskippedLables,
      {
        x: 2*this.props.padding + this.columnWidth/2,
        y: this.props.height - this.props.padding
      },
      spacing
    );
  }
}
