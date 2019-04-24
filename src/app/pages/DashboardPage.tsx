import * as React from "react";
import {Component} from "react";
import {Timeline, Icon} from "antd";
import {get} from "../libs/utils/request";
import {user} from "../libs/utils/user";
import Row from "antd/lib/grid/row";
import {Bar, Doughnut, Pie, Line} from "react-chartjs-2"
import PageTitle from "../components/utils/PageTitle";
import Button from "antd/lib/button";

type props = {}

type state = {
  actions?: Array<Action>
  profitOfCats?: ChartData
  profitPercent?: ChartData
  selectedMonth?: Date
  dateFrom: Date
  dateTo: Date
}

interface Action {
  date: Date
  name: string
  color: string
}

interface Response {
  actions: Array<Action>
}

interface ChartResponse {
  profitPercent?: Array<[number, string]>
  profitsByCategories?: Array<[number, string]>
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


class DashboardPage extends Component<props, state> {
  state = {
    actions: Array<Action>(),
    profitOfCats: new class implements ChartData {
      datasets: [{ _meta?: {}; data: number[]; backgroundColor?: string[]; borderColor?: string; borderWidth?: number; hoverBackgroundColor?: string; hoverBorderColor?: string; label?: string }];
      labels: any[];
    },
    profitPercent: new class implements ChartData {
      datasets: [{ _meta?: {}; data: number[]; backgroundColor?: string[]; borderColor?: string; borderWidth?: number; hoverBackgroundColor?: string; hoverBorderColor?: string; label?: string }];
      labels: any[];
    },
    selectedMonth: new Date(),
    dateFrom: new Date(),
    dateTo: new Date()
  }


  componentDidMount(): void {
    let dateTo: Date = new Date()
    let dateFrom: Date = new Date()
    dateFrom.setMonth(dateTo.getMonth() - 1)
    this.setSelectedDateToRange()
    this.fetchRecentActions()
    this.fetchDasboardItems()
    this.fetchDoughnutChart()
  }

  fetchRecentActions = async () => {
    await get(`get-recent-actions?email=${user().email}`)
      .then((response: Response) => {
        this.setState({
          actions: response.actions,
        })
      })
  }

  setSelectedDateToRange = () => {
    let dateFrom: Date = new Date(this.state.selectedMonth)
    let dateTo: Date = new Date(this.state.selectedMonth)

    dateTo.setMonth(dateTo.getMonth() + 1)
    dateFrom.setDate(1)
    dateTo.setDate(0)
    this.setState({
      dateFrom: dateFrom,
      dateTo: dateTo
    })

  }

  fetchDasboardItems = async () => {
    let values = []
    let labels = []
    let bgs = []
    let resp: ChartResponse;
    this.setSelectedDateToRange()
    await get('get-profit', {from: this.state.dateFrom.getTime(), to: this.state.dateTo.getTime()})
      .then((response: ChartResponse) => {
        resp = response
      })
    for (let cat of resp.profitsByCategories) {
      values.push(cat[0])
      labels.push(cat[1])
      bgs.push("#36A2EB")
    }
    let data: ChartData = {
      datasets: [
        {
          data: values,
          label: 'profit',
          backgroundColor: bgs,
        }
      ],
      labels: labels
    }
    this.setState({
      profitOfCats: data
    })
  }

  fetchDoughnutChart = async () => {
    let resp: ChartResponse;
    await get('get-profit-percent')
      .then((response: ChartResponse) => {
        resp = response
      })
    console.log(resp)
    if (resp.profitPercent != undefined) {
      let result: ChartData = this.castResposeToDoughnutChartDataObject(resp)
      this.setState({
        profitPercent: result
      })
    }
  }

  castResposeToDoughnutChartDataObject = (rawData: ChartResponse): ChartData => {
    let values = []
    let labels = []
    for (let data of rawData.profitPercent) {
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

  renderTimeLineItems = (): React.ReactNode => {
    let timeLineActions = []
    if (this.state.actions.length != null)
      for (let action of this.state.actions) {
        let date = new Date(action.date)
        timeLineActions.push(<Timeline.Item key={action.date + ''}
                                            color={action.color.toLowerCase()}><span
          style={{fontWeight: 'bold'}}>{date.toLocaleDateString()}</span> - {action.name}</Timeline.Item>)
      }
    return timeLineActions
  }

  handleMonthChange = (num: number) => {
    let date: Date = new Date(this.state.selectedMonth)
    date.setMonth(this.state.selectedMonth.getMonth() + num)
    this.setState({
      selectedMonth: date
    })
    this.fetchDasboardItems()
  }

  render() {

    const chartOptions: Options = {
      legend: {
        display: true,
        position: 'bottom'
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      },
      title: {
        display: true,
        text: 'Profit earned per product type'
      }
    }

    const doughnutOptions: Options = {
      legend: {
        display: true,
        position: 'bottom'
      },
      title: {
        display: true,
        text: 'Top 5 product\'s profit portion'
      }
    }

    const monthlyCharts = {width: 500, height: 300, border: '1px solid #ccc', borderRadius: 7, paddingBottom: 0, margin: 30, backgroundColor: '#F2F2FF'}

    const currentDate = new Date()

    return <div>
      <PageTitle title={'Dashboard'}/>

      <Row type={"flex"} justify={"space-around"} style={{marginBottom: 30}}>
        <div style={{border: '1px solid #ccc', borderRadius: 7, padding: '30px 15px 0px 15px', maxWidth: '40%', backgroundColor: '#F2F2FF'}}>
          <Row type={"flex"} justify={"space-around"}>
            <h2 style={{borderBottom: '1px solid #ccc', width: '100%', marginBottom: 30}}>Recent actions</h2>
          </Row>
          <Timeline>
            {this.renderTimeLineItems()}
          </Timeline>
        </div>
        <div style={{border: '1px solid #ccc', borderRadius: 7, paddingBottom: 0, margin: 5, maxHeight: 380, backgroundColor: '#F2F2FF'}}>
          <Doughnut data={this.state.profitPercent} height={355} width={290} options={doughnutOptions}/>
        </div>
        <div style={{border: '1px solid #ccc', borderRadius: 7, paddingBottom: 0, margin: 5, maxHeight: 380, backgroundColor: '#F2F2FF'}}>
          <Pie data={this.state.profitPercent} height={355} width={290} options={doughnutOptions}/>
        </div>
      </Row>

        <Row type={"flex"} justify={"space-between"} style={{maxWidth: 200, marginBottom: 30}}>
          <Button onClick={() => this.handleMonthChange(-1)}><Icon type="left"/></Button>
          <div style={{
            height: 32,
            padding: '5px 10px 0px 10px',
            border: '1px solid #ccc',
            borderRadius: 4,
            textAlign: 'center',
            backgroundColor: '#fff'
          }}>
            {`${this.state.selectedMonth.getFullYear()}. ${this.state.selectedMonth.getMonth() + 1 < 9 ? '0' : ''}${this.state.selectedMonth.getMonth() + 1}`}
          </div>
          <Button onClick={() => this.handleMonthChange(1)} disabled={this.state.selectedMonth >= currentDate}><Icon
            type="right"/></Button>
          <div>{this.state.dateFrom.toLocaleDateString()} - {this.state.dateTo.toLocaleDateString()}</div>
        </Row>

      <Row type={"flex"} justify={"space-around"}>
        <div style={monthlyCharts}>
          <Bar data={this.state.profitOfCats} options={chartOptions}/>
        </div>
        <div style={monthlyCharts}>
          <Line data={this.state.profitOfCats} options={chartOptions}/>
        </div>
        <div style={monthlyCharts}>
          <Line data={this.state.profitOfCats} options={chartOptions}/>
        </div>
        <div style={monthlyCharts}>
          <Bar data={this.state.profitOfCats} options={chartOptions}/>
        </div>

      </Row>
    </div>
  }
}

export default DashboardPage;
