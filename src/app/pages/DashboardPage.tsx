import * as React from "react";
import {Component} from "react";
import {Timeline, Icon} from "antd";
import {get} from "../libs/utils/request";
import {user} from "../libs/utils/user";
import Row from "antd/lib/grid/row";
import {Bar, Line} from "react-chartjs-2"
import PageTitle from "../components/utils/PageTitle";
import Button from "antd/lib/button";
import RoundChart from "../components/charts/RoundChart";

type props = {}

type state = {
  actions?: Array<Action>
  profitOfCats?: ChartData
  profitPercent?: Array<[number, string]>
  selectedMonth?: Date
  dateFrom: Date
  dateTo: Date
  top5Annual: Array<[number, string]>
  top5Monthly: Array<[number, string]>
  top5Weekly: Array<[number, string]>
  top5Other: Array<[number, string]>
  isExtended: boolean
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
    profitPercent: Array<[number, string]>(),
    selectedMonth: new Date(),
    dateFrom: new Date(),
    dateTo: new Date(),
    top5Annual: Array<[number, string]>(),
    top5Monthly: Array<[number, string]>(),
    top5Weekly: Array<[number, string]>(),
    top5Other: Array<[number, string]>(),
    isExtended: false
  }


  componentDidMount(): void {
    let dateTo: Date = new Date()
    let dateFrom: Date = new Date()
    dateFrom.setMonth(dateTo.getMonth() - 1)
    this.setSelectedDateToRange()
    this.fetchRecentActions()
    this.fetchDasboardItems()
    this.fetchDoughnutCharts()
  }

  fetchRecentActions = async () => {
    await get('get-recent-5-actions', {email: user().email})
      .then((response: Response) => {
        this.setState({
          actions: response.actions,
          isExtended: false
        })
      })
  }

  extendActionsHandler = async () => {
    await get('get-recent-10-actions', {email: user().email})
      .then((response: Response) => {
        this.setState({
          actions: response.actions,
          isExtended: true
        })
      })
  }

  collapseActionsHandler = () => {
    this.fetchRecentActions()
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

  fetchDoughnutCharts = async () => {
    this.fetchProfitPercent()
    this.fetchTop5AnnualCost()
    this.fetchTop5MonthlyCost()
    this.fetchTop5WeeklyCost()
    this.fetchTop5OtherCost()
  }

  fetchProfitPercent = async () => {
    await get('get-profit-percent')
      .then((response: { profitPercent: Array<[number, string]> }) => {
        console.log(response)
        this.setState({
          profitPercent: response.profitPercent
        })
      })
  }

  fetchTop5AnnualCost = async () => {
    await get('get-top5-annual', {email: user().email})
      .then((response: { costs: Array<[number, string]> }) => {
        this.setState({
          top5Annual: response.costs
        })
      })
  }

  fetchTop5WeeklyCost = async () => {
    await get('get-top5-weekly', {email: user().email})
      .then((response: { costs: Array<[number, string]> }) => {
        this.setState({
          top5Weekly: response.costs
        })
      })
  }

  fetchTop5MonthlyCost = async () => {
    await get('get-top5-monthly', {email: user().email})
      .then((response: { costs: Array<[number, string]> }) => {
        this.setState({
          top5Monthly: response.costs
        })
      })
  }

  fetchTop5OtherCost = async () => {
    await get('get-top5-other', {email: user().email})
      .then((response: { costs: Array<[number, string]> }) => {
        this.setState({
          top5Other: response.costs
        })
      })
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
    const btnStyle = {fontSize: '1em', padding: '0px 8px', margin: 5}

    const toggleActionsButton = !this.state.isExtended ?
      <Button shape={'round'} type={'primary'} onClick={this.extendActionsHandler} style={btnStyle}><Icon type="down"/></Button> :
      <Button shape={'round'} type={'primary'} onClick={this.collapseActionsHandler} style={btnStyle}><Icon type="up"/></Button>

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

    const monthlyCharts = {
      width: 500,
      height: 300,
      border: '1px solid #ccc',
      borderRadius: 7,
      paddingBottom: 0,
      margin: 30,
      backgroundColor: '#F2F2FF'
    }

    const currentDate = new Date()

    const widgetStyle = {
      border: '1px solid #ccc',
      borderRadius: 7,
      paddingBottom: 0,
      margin: 5,
      maxHeight: 350,
      backgroundColor: '#F2F2FF'
    }

    const costChartHeight = 300
    const costChartWidth = 270


    return <div>
      <PageTitle title={'Dashboard'}/>
      <Row type={"flex"} justify={"space-around"} style={{marginBottom: 30}}>
        <div style={{
          border: '1px solid #ccc',
          borderRadius: 7,
          padding: '30px 15px 0px 15px',
          maxWidth: '40%',
          backgroundColor: '#F2F2FF'
        }}>
          <Row type={"flex"} justify={"space-around"}>
            <h2 style={{borderBottom: '1px solid #ccc', width: '100%', marginBottom: 30}}>Recent actions</h2>
          </Row>
          <Timeline>
            {this.renderTimeLineItems()}
          </Timeline>
          <Row type={"flex"} justify={"space-around"}>
            {toggleActionsButton}
          </Row>
        </div>
        <div style={{
          border: '1px solid #ccc',
          borderRadius: 7,
          paddingBottom: 0,
          margin: 5,
          maxHeight: 380,
          backgroundColor: '#F2F2FF'
        }}>
          <RoundChart data={this.state.profitPercent}
                      height={355}
                      width={290}
                      title={'Top 5 product\'s profit portion'}
                      type={'DOUGHNUT'}
          />
        </div>
        <div style={{
          border: '1px solid #ccc',
          borderRadius: 7,
          paddingBottom: 0,
          margin: 5,
          maxHeight: 380,
          backgroundColor: '#F2F2FF'
        }}>
          <RoundChart data={this.state.profitPercent}
                      height={355}
                      width={290}
                      title={"another chart"}
                      type={'DOUGHNUT'}
          />
        </div>
      </Row>

      <Row type={"flex"} justify={"space-around"}>
        <div style={widgetStyle}><RoundChart data={this.state.top5Annual} height={costChartHeight}
                                             width={costChartWidth} type={'PIE'} title={'The 5 highest annual costs'}/>
        </div>
        <div style={widgetStyle}><RoundChart data={this.state.top5Monthly} height={costChartHeight}
                                             width={costChartWidth} type={'PIE'} title={'The 5 highest monthly costs'}/>
        </div>
        <div style={widgetStyle}><RoundChart data={this.state.top5Weekly} height={costChartHeight}
                                             width={costChartWidth} type={'PIE'} title={'The 5 highest weekly costs'}/>
        </div>
        <div style={widgetStyle}><RoundChart data={this.state.top5Other} height={costChartHeight} width={costChartWidth}
                                             type={'PIE'} title={'The 5 highest other costs'}/></div>
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
