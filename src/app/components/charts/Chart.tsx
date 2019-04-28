import React from "react";
import {Bar, Doughnut, Pie, Polar, Radar} from "react-chartjs-2";
import {array} from "prop-types";

type props = {
  data: Array<[number, string]>
  title?: string
  height: number
  width: number
  type: string
  colors: Array<string>
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


class Chart extends React.Component<props, state> {
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
      labels.push(data[1][0] == '2' ? data[1].slice(0,10) : data[1])
    }
    let resultChartObject: ChartData = {
      datasets: [
        {
          data: values,
          backgroundColor: this.props.colors.length >= values.length ? this.props.colors : this.generateColors()
        }
      ],
      labels: labels
    }
    return resultChartObject;
  }

  generateColors = ():Array<string> => {
    const colors = {...this.props.colors}

    while (colors.length !> this.props.data.length) {
      colors.concat(colors)
    }

    return colors
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

    let chart;
    if(this.props.type === 'PIE') {
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
    }

    return (
      <div>
        {chart}
      </div>
    )
  }

}

export default Chart;
