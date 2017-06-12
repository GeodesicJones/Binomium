
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { n: 8, p: 0.5, numObservations: 400};
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
          <div id="interactive">
            <Chart
              id="chart"
              width={300}
              height={300}
              series={this.state.series}
              labels={this.state.labels}
            />
            <div id="controls">
              <div>
                n:{" "}
                <input
                  type="text"
                  defaultValue={this.state.n}
                  onChange={this.onBlurN}
                />
              </div>
              <div>
                p:{" "}
                <input
                  type="text"
                  defaultValue={this.state.p}
                  onChange={this.onBlurP}
                />
              </div>
              <div>
                #: {" "}
                <input
                  type="text"
                  defaultValue={this.state.numObservations}
                  onChange={this.onBlurNumObservations}
                />
              </div>
              <input type="button" onClick={this.onClick} value="Make It So" />
            </div>
          </div>
          <div id="description">
            The Binomium is a playground for exploring binomial distributions.
            Right now it's pretty simple: it simulates tossing a handful of coins
            and counting how many land heads up.
            <p/>
            To operate, fill in the inputs:
            <ul>
              <li>n: the number of coins to toss</li>
              <li>p: the probability each coin will land heads up (these coins aren't always fair)</li>
              <li>#: the number of times to toss the whole handful</li>
            </ul>
            Then click 'Make It So', and it will.
            <p/>
            What's interesting is how a series of random events approximates
            a non-random shape.
            In my mind, it's a very simple example of emergent phenomana.
          </div>
      </div>
    );
  }
}

let component = ReactDOM.render(<App />, document.getElementById("app"));
