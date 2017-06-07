
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { n: 8, p: 0.5, numObservations: 400, data: [], labels: "" };
    this.onClick = this.onClick.bind(this);
    this.onBlurN = this.onBlurN.bind(this);
    this.onBlurP = this.onBlurP.bind(this);
    this.onBlurNumObservations  = this.onBlurNumObservations.bind(this);
    this.getObservation = this.getObservation.bind(this);
  }

  onClick() {
    let p = this.state.p;
    let n = this.state.n;
    let count = this.state.numObservations;
    let values = [];
    let labels = [];

    for (let i = 0; i <= n; i++) {
      labels.push(i);
    }

    for (let i = 0; i < count; i++) {
      values.push(0);
    }

    let series = {
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
  onBlurNumObservations(event){
    this.setState({ numObservations: event.target.value });
  }

  render() {
    return (
        <div>
          <h1>Welcome to The Binomium</h1>
          <Chart
            width={550}
            height={450}
            id="chart"
            padding={15}
            series={this.state.series}
            labels={this.state.labels}
          />
          <div id="controls">
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
            #: {" "}
            <input
              type="text"
              defaultValue={this.state.numObservations}
              onChange={this.onBlurNumObservations}
            />
            <br />
            <input type="button" onClick={this.onClick} value="Make It So" />
          </div>
      </div>
    );
  }
}

let component = ReactDOM.render(<App />, document.getElementById("app"));
