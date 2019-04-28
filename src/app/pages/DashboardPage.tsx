import * as React from "react";
import {Component} from "react";
import {Timeline, Icon} from "antd";
import {get} from "../libs/utils/request";
import {user} from "../libs/utils/user";
import Row from "antd/lib/grid/row";
import {Bar, Line} from "react-chartjs-2"
import PageTitle from "../components/utils/PageTitle";
import Button from "antd/lib/button";
import Chart from "../components/charts/Chart";
import Tabs from "antd/lib/tabs";
import TimeRangeSwitcher from "../components/utils/TimeRangeSwitcher";
import moment = require("moment");
import BarChart from "../components/charts/BarChart";

const TabPane = Tabs.TabPane;

type props = {}

type state = {
  actions?: Array<Action>
  profitOfCats?: ChartData
  profitPercent?: Array<[number, string]>
  dateFrom: Date
  dateTo: Date
  top5Annual: Array<[number, string]>
  top5Monthly: Array<[number, string]>
  top5Weekly: Array<[number, string]>
  top5Other: Array<[number, string]>
  profitPerDays: Array<[number, Date]>
  incomePerDays: Array<[number, Date]>
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
    dateFrom: moment().month(new Date().getMonth()).startOf("month").toDate(),
    dateTo: moment().month(new Date().getMonth()).endOf("month").toDate(),
    top5Annual: Array<[number, string]>(),
    top5Monthly: Array<[number, string]>(),
    top5Weekly: Array<[number, string]>(),
    top5Other: Array<[number, string]>(),
    profitPerDays: Array<[number, Date]>(),
    incomePerDays: Array<[number, Date]>(),
    isExtended: false
  }


  componentDidMount(): void {
    this.fetchRecentActions()
    this.fetchDoughnutCharts()
    this.fetchMonthlyDashBoardItems()
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


  fetchMonthlyDashBoardItems = () => {
    this.fetchProfitPerProductTypes()
    this.fetchProfitPerDays()
    this.fetchIncomePerDays()
  }

  fetchProfitPerProductTypes = async () => {
    let values = []
    let labels = []
    let bgs = []
    let resp: ChartResponse;
    await get('get-profit', {from: this.state.dateFrom.getTime(), to: this.state.dateTo.getTime()})
      .then((response: ChartResponse) => {
        resp = response
      })
    for (let cat of resp.profitsByCategories) {
      values.push(cat[0])
      labels.push(cat[1])
      bgs.push(cat[0] < 0 ? 'rgb(255,34,45, 1)' : "#36A2EB")
    }
    let data: ChartData = {
      datasets: [
        {
          data: values,
          label: 'Profit',
          backgroundColor: bgs,
        }
      ],
      labels: labels
    }
    this.setState({
      profitOfCats: data
    })
  }

  fetchProfitPerDays = async () => {
    await get('get-profit-per-days', {
      dateFrom: this.state.dateFrom.getTime(),
      dateTo: this.state.dateTo.getTime(),
      email: user().email
    })
      .then((response: { profitPerDays: Array<[number, Date]> }) => {
        this.setState({
          profitPerDays: response.profitPerDays
        })
      })
  }

  fetchIncomePerDays = async () => {
    await get('get-income-per-days', {
      dateFrom: this.state.dateFrom.getTime(),
      dateTo: this.state.dateTo.getTime(),
      email: user().email
    })
      .then((response: { incomePerDays: Array<[number, Date]> }) => {
        this.setState({
          incomePerDays: response.incomePerDays
        })
      })
  }

  fetchDoughnutCharts = () => {
    this.fetchProfitPercent()
    this.fetchTop5AnnualCost()
    this.fetchTop5MonthlyCost()
    this.fetchTop5WeeklyCost()
    this.fetchTop5OtherCost()
  }


  fetchProfitPercent = async () => {
    await get('get-profit-percent')
      .then((response: { profitPercent: Array<[number, string]> }) => {
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

  setTimeRange = (from: Date, to: Date) => {
    this.setState({
      dateFrom: from,
      dateTo: to
    })
    this.fetchMonthlyDashBoardItems()
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
      width: window.innerWidth * 0.8,
      height: 300,
      border: '1px solid #ccc',
      borderRadius: 7,
      paddingBottom: 0,
      marginBottom: 15,
      backgroundColor: '#F2F2FF'
    }

    const chartStyle = {
      border: '1px solid #ccc',
      borderRadius: 7,
      paddingBottom: 0,
      marginBottom: 15,
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

    const colorSet1 = ["#FF6384", "#4BC0C0", "#FFCE56", "#E7E9ED", "#36A2EB"]
    const blueColorSet = ['#1ec0ff', '#a3daff', '#0080ff', '#03a6ff']
    const darkBlueColorSet = ['#005f6b', '#00dffc', '#008c9e', '#343838']
    const colorfulColorSet = ['#FFBC42', "#8F2D56", "#218380", "#D81159", "#36A2EB"]


    return <div>
      <PageTitle title={'Dashboard'}/>
      <Tabs type="card">
        <TabPane tab={<div><Icon type="pie-chart"/>Overview</div>} key={"1"}>
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
              <Chart data={this.state.profitPercent}
                     height={355}
                     width={290}
                     title={'Top 5 product\'s profit portion'}
                     type={'DOUGHNUT'}
                     colors={colorSet1}

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
              <Chart data={this.state.profitPercent}
                     height={355}
                     width={290}
                     title={"another chart"}
                     type={'POLAR'}
                     colors={colorSet1}

              />
            </div>
          </Row>

          <Row type={"flex"} justify={"space-around"}>
            <div style={widgetStyle}>
              <Chart data={this.state.top5Annual}
                     height={costChartHeight}
                     width={costChartWidth} type={'PIE'} title={'The 5 highest annual costs'}
                     colors={blueColorSet}
              />
            </div>
            <div style={widgetStyle}>
              <Chart data={this.state.top5Monthly}
                     height={costChartHeight}
                     width={costChartWidth} type={'PIE'} title={'The 5 highest monthly costs'}
                     colors={blueColorSet}
              />
            </div>
            <div style={widgetStyle}>
              <Chart data={this.state.top5Weekly}
                     height={costChartHeight}
                     width={costChartWidth} type={'PIE'} title={'The 5 highest weekly costs'}
                     colors={blueColorSet}
              />
            </div>
            <div style={widgetStyle}>
              <Chart data={this.state.top5Other}
                     height={costChartHeight} width={costChartWidth}
                     type={'PIE'} title={'The 5 highest other costs'}
                     colors={blueColorSet}
              /></div>
          </Row>
        </TabPane>
        <TabPane tab={<div><Icon type="bar-chart"/>Monthly view</div>} key="2">

          <TimeRangeSwitcher returnRange={this.setTimeRange}/>

          <Row type={"flex"} justify={"space-around"}>
            <div style={chartStyle}>
              <BarChart
                data={this.state.profitPerDays}
                height={300}
                width={window.innerWidth * 0.8}
                type={'BAR'}
                title={'Profit earned per days'}/>
            </div>
          </Row>
          <Row type={"flex"} justify={"space-around"}>
            <div style={chartStyle}>
              <BarChart
                data={this.state.incomePerDays}
                secondData={this.state.profitPerDays}
                height={300}
                width={window.innerWidth * 0.8}
                type={'BAR'}
                title={'Income per days'}/>
            </div>
          </Row>
          <Row type={"flex"} justify={"space-around"}>
            <div style={monthlyCharts}>
              <Bar data={this.state.profitOfCats} options={chartOptions} height={300} width={window.innerWidth * 0.8}/>
            </div>
          </Row>
        </TabPane>
      </Tabs>

    </div>
  }
}

export default DashboardPage;
