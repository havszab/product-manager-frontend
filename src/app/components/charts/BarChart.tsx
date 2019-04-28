import React from "react";
import {Bar} from "react-chartjs-2";

type props = {
  data: Array<[number, Date]>
  secondData?: Array<[number, Date]>
  title?: string
  height: number
  width: number
  type: string
  //colors: Array<string>
}
type state = {
  data: ChartData
}

interface ChartData {
  datasets: Array<{
    '_meta'?: {}
    data: number[]
    backgroundColor?: string[]
    borderColor?: string
    borderWidth?: number
    hoverBackgroundColor?: string
    hoverBorderColor?: string
    label?: string
    type?: string
    fill?: boolean
  }>,
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

class BarChart extends React.Component<props, state> {
  state = {
    data: new class implements ChartData {
      datasets: Array<{ _meta?: {}; data: number[]; backgroundColor?: string[]; borderColor?: string; borderWidth?: number; hoverBackgroundColor?: string; hoverBorderColor?: string; label?: string; type?: string; fill?: boolean }>;
      labels: any[];
    }
  }

  castResponseToChartDataObject = (rawData: Array<[number, Date]>): ChartData => {
    let values = []
    let lineValues = []
    let labels = []
    let bgs = []
    for (let data of rawData) {
      values.push(Math.round(data[0] * 1e2) / 1e2)
      labels.push(new Date(data[1]).toLocaleDateString())
      bgs.push(data[0] < 0 ? 'rgb(255,34,45, 1)' : 'rgb(24,144,255, 0.4)')
    }
    if (this.props.secondData) {
      for (let data of this.props.secondData) {
        lineValues.push(Math.round(data[0] * 1e2) / 1e2)
        //labels.push(new Date(data[1]).toLocaleDateString())
        //bgs.push(data[0] < 0 ? 'rgb(255,34,45, 1)' : 'rgb(24,144,255, 0.4)')
      }
    }

    let data = this.props.secondData ?
      {
        datasets: [
          {
            data: values,
            label: 'Amount',
            backgroundColor: bgs,
            borderColor: 'rgb(24,144,255)',
            borderWidth: 1
          },
          {
            data:lineValues,
            label: 'Profit', // hardcoded yet
            type: 'line',
            fill: false,
            borderColor: '#52c41a',
            backgroundColor: ['#52c41a']
          }],
        labels: labels
      } : {
        datasets: [
          {
            data: values,
            label: 'Amount',
            backgroundColor: bgs,
            borderColor: 'rgb(24,144,255)',
            borderWidth: 1
          }
        ],
        labels: labels
      }

    let resultChartObject: ChartData = data
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

    let chart;
    if (this.props.type === 'BAR') {
      chart = <Bar data={this.castResponseToChartDataObject(this.props.data)}
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

export default BarChart;
