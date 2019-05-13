import React from "react";
import {Bar, Doughnut, Line, Pie, Polar, Radar} from "react-chartjs-2";

type props = {
  data: Array<[number, string]>
  title?: string
  height: number
  width: number
  type: string
  colors?: Array<string>
  label?: string
  toMillion?: boolean
  labelPosition?: string
}
type state = {
  data: ChartData
}

interface ChartData {
  datasets: [
    {
      '_meta'?: {}
      data: number[]
      backgroundColor?: string[]
      borderColor?: string
      borderWidth?: number
      hoverBackgroundColor?: string
      hoverBorderColor?: string
      label?: string
    }
    ],
  labels?: any[]
}

interface Options {
  legend?: {
    display?: boolean
    position?: string
  }
  scales?: {
    yAxes?: [{
      ticks?: {
        max?: number
        min?: number
        stepSize?: number
        beginAtZero?: boolean
      }
    }]
  },
  title?: {
    display?: boolean,
    text?: string
  },
  tooltipTemplate: {},
  scaleLabel: {}
}

const allColors = ["#FF6384", "#4BC0C0", "#FFCE56",
  "#36A2EB", '#1ec0ff', '#a3daff', '#0080ff',
  '#03a6ff', '#00dffc', '#005f6b', '#00dffc',
  '#008c9e', '#343838', '#FFBC42', "#8F2D56",
  "#218380", "#D81159", "#E7E9ED", "#36A2EB"]

class Chart extends React.Component<props, state> {
  state = {
    data: new class implements ChartData {
      datasets: [{ _meta?: {}; data: number[]; backgroundColor?: string[]; borderColor?: string; borderWidth?: number; hoverBackgroundColor?: string; hoverBorderColor?: string; label?: string }];
      labels: any[];
    },
  }

  componentDidMount(): void {
  }

  castResponseToDoughnutChartDataObject = (rawData: Array<[number, string]>): ChartData => {
    let values = []
    let labels = []
    for (let data of rawData) {
      values.push( this.props.toMillion ? Math.round((data[0] * 1e2)  / 1000000) / 1e2 : Math.round((data[0] * 1e2) ) / 1e2)
      labels.push(data[1][0] == '2' ? data[1].slice(0, 10) : data[1])
    }
    let resultChartObject: ChartData = {
      datasets: [
        {
          data: values,
          label: this.props.label,
          backgroundColor: this.props.colors ? this.props.colors : allColors
        }
      ],
      labels: labels
    }
    return resultChartObject;
  }

  render() {

    const options: Options = {
      legend: {
        display: true,
        position: this.props.labelPosition? this.props.labelPosition: 'bottom'
      },
      title: {
        display: true,
        text: this.props.title
      },
      scaleLabel: "<%=parseInt(value).toLocaleString()%>",
      tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%=value.toLocaleString()%>"
    }

    let chart;
    if (this.props.type === 'PIE') {
      chart = <Pie data={this.castResponseToDoughnutChartDataObject(this.props.data)}
                   options={options}
                   height={this.props.height}
                   width={this.props.width}
      />
    } else if (this.props.type === 'DOUGHNUT') {
      chart = <Doughnut data={this.castResponseToDoughnutChartDataObject(this.props.data)}
                        options={options}
                        height={this.props.height}
                        width={this.props.width}
      />
    } else if (this.props.type === 'POLAR') {
      chart = <Polar data={this.castResponseToDoughnutChartDataObject(this.props.data)}
                     options={options}
                     height={this.props.height}
                     width={this.props.width}
      />
    } else if (this.props.type === 'BAR') {
      chart = <Bar data={this.castResponseToDoughnutChartDataObject(this.props.data)}
                   options={options}
                   height={this.props.height}
                   width={this.props.width}
      />
    } else if (this.props.type === 'LINE') {
      chart = <Line data={this.castResponseToDoughnutChartDataObject(this.props.data)}
                    options={options}
                    height={this.props.height}
                    width={this.props.width}
      />
    }

    return (
      <div>
        {chart}
      </div>
    )
  }

}

export default Chart;
