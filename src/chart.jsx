class Chart extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <canvas id={this.props.id} height={this.props.height} width={this.props.width} />
    );
  }
  componentDidMount() {
    this.canvas = document.getElementById(this.props.id);
    this.chart = {
      width: this.props.width,
      height: this.props.height,
      padding: 15
    };

    this.vAxis = {}
    this.vAxis.padding = 5;
    this.vAxis.textWidth = 20;
    this.vAxis.width = this.vAxis.padding + this.vAxis.textWidth;

    this.hAxis = {}
    this.hAxis.padding = 3;
    this.hAxis.textHeight = 15;
    this.hAxis.height = this.hAxis.padding + this.hAxis.textHeight;

    this.chartArea = {}
    this.chartArea.x = this.chart.padding + this.vAxis.width;
    this.chartArea.y = this.chart.height - this.chart.padding - this.hAxis.height;
    this.chartArea.width = this.chart.width - this.chart.padding - this.chartArea.x;
    this.chartArea.height = this.chartArea.y - this.chart.padding;

    let draw = new AnimationDraw(this.props.id);
    this.build = new AnimationBuild();
    let build = this.build;
    this.buildBorderAnimation(build);
    draw.animate(build.frames);
  }

  get columnWidth(){
    return this.chart.width/2/this.props.labels.length;
  }

  componentDidUpdate(nextProps, nextState) {
    let build = new AnimationBuild();
    build.clear(1, 1, this.chart.width - 2, this.chart.height - 2);
    this.buildAxisAnimation(build);
    this.buildSeriesAnimation(build, this.props.series, this.props.labels.length);

    if(!this.draw) this.draw = new AnimationDraw(this.props.id);
    this.draw.cancelCurrentAnimation();
    this.draw.animate(build.frames);
  }

  shouldComponentUpdate(nextProps, nextState){
    return nextProps.series != this.props.series;
  }

  buildBorderAnimation(build) {
    let delta = 30;
    build.line({ x: 0, y: 0 }, { x: this.chart.width, y: 0 }, delta);
    build.line(
      { x: this.chart.width, y: 0 },
      { x: this.chart.width, y: this.chart.height },
      delta
    );
    build.line(
      { x: this.chart.width, y: this.chart.height },
      { x: 0, y: this.chart.height },
      delta
    );
    build.line({ x: 0, y: this.chart.height }, { x: 0, y: 0 },delta);
  }

  buildSeriesAnimation(build, series, columnCount) {
    let maxColumnHeight = 0;
    for (let i = 0; i < series.data.length; i++) {
      if(series.data[i].value > maxColumnHeight){
        maxColumnHeight  = series.data[i].value;
      }
    }
    let verticalScalingFactor =  this.chartArea.height / series.max;

    for (let i = 0; i < series.data.length; i++) {
      let index = series.data[i].index;
      let value = series.data[i].value *  verticalScalingFactor;
      let spacing = (this.chartArea.width - 2*this.chart.padding) / columnCount;
      build.column(
        this.columnWidth,
        value,
        {
          x: this.chartArea.x + this.chart.padding + index * spacing,
          y: this.chartArea.y - 1
        });
    }
  }

  buildAxisAnimation(build) {
    // draw horizontal axis
    let delta = 10;
    build.line(
      { x: this.chartArea.x, y: this.chartArea.y },
      { x: this.chartArea.x + this.chartArea.width, y: this.chartArea.y },
      delta
    );

    // add labels to horizontal axis
    let skipFactor = 1 + Math.floor(this.props.labels.length/10);
    let unskippedLables = [];
    for(let i = 0; i < this.props.labels.length; i += skipFactor){
      unskippedLables.push(this.props.labels[i]);
    }

    let hSpacing = skipFactor * (this.chartArea.width - 2*this.chart.padding) / this.props.labels.length;
    build.text(
      unskippedLables,
      {
        x: this.chartArea.x + this.chart.padding + this.columnWidth/2,
        y: this.chartArea.y + this.hAxis.padding + this.hAxis.textHeight
      },
      hSpacing
    );

    // add vertical axis
    build.line(
      {x: this.chartArea.x, y: this.chartArea.y},
      {x: this.chartArea.x, y: this.chart.padding},
      delta
    );

    // add labels to vertical axis

    let vSpacing = this.chartArea.height/4;
    let series = this.props.series;
    build.text(
      [
        "",
        Math.round(series.max/4),
        Math.round(series.max/2),
        Math.round(series.max/4),
        series.max
      ],
      {
        x: this.chartArea.x - this.vAxis.width/2,
        y: this.chartArea.y + this.hAxis.textHeight/2
      },
      vSpacing,
      "vertical"
    );
  }
}
