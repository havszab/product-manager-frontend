import React from "react";
import {Doughnut, Pie} from "react-chartjs-2";

type props = {
  data: Array<[number, string]>
  title?: string
  height: number
  width: number
  type: string
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
  }
}


class RoundChart extends React.Component<props, state> {
  state = {
    data: new class implements ChartData {
      datasets: [{ _meta?: {}; data: number[]; backgroundColor?: string[]; borderColor?: string; borderWidth?: number; hoverBackgroundColor?: string; hoverBorderColor?: string; label?: string }];
      labels: any[];
    }
  }

  castResponseToDoughnutChartDataObject = (rawData: Array<[number, string]>): ChartData => {
    let values = []
    let labels = []
    for (let data of rawData) {
      values.push(Math.round(data[0] * 1e2) / 1e2)
      labels.push(data[1])
    }
    let resultChartObject: ChartData = {
      datasets: [
        {
          data: values,
          backgroundColor: ["#FF6384", "#4BC0C0", "#FFCE56", "#E7E9ED", "#36A2EB"]
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
        position: 'bottom'
      },
      title: {
        display: true,
        text: this.props.title
      }
    }

    const chart = this.props.type === 'PIE' ?
      <Pie data={this.castResponseToDoughnutChartDataObject(this.props.data)}
                options={options}
                height={this.props.height}
                width={this.props.width}
      /> :
      <Doughnut data={this.castResponseToDoughnutChartDataObject(this.props.data)}
                options={options}
                height={this.props.height}
                width={this.props.width}
      />

    return (
      <div>
        {chart}
      </div>
    )
  }

}

export default RoundChart;
