import * as React from "react";
import {Component} from "react";
import {Timeline, Icon, message} from "antd";
import {get} from "../libs/utils/request";
import {user} from "../libs/utils/user";
import Row from "antd/lib/grid/row";
import {Bar, Line} from "react-chartjs-2"
import PageTitle from "../components/utils/PageTitle";
import Tabs from "antd/lib/tabs";
import TimeRangeSwitcher from "../components/utils/TimeRangeSwitcher";
import moment = require("moment");
import BarChart from "../components/charts/BarChart";
import AnnualDashboardTab from "./tabs/AnnualDashboardTab";
import OverviewTab from "./tabs/OverviewTab";
import i18n from '../libs/i18n'

const TabPane = Tabs.TabPane;

type props = {}

type state = {
  actions?: Array<Action>
  dateFrom: Date
  dateTo: Date
  profitOfCats?: ChartData
  profitPercent?: Array<[number, string]>
  incomesOfYears: Array<[number, string]>
  top5Annual: Array<[number, string]>
  top5Monthly: Array<[number, string]>
  top5Weekly: Array<[number, string]>
  top5Other: Array<[number, string]>
  profitPerDays: Array<[number, string]>
  incomePerDays: Array<[number, string]>
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
    profitPerDays: Array<[number, string]>(),
    incomePerDays: Array<[number, string]>(),
    incomesOfYears: Array<[number, string]>(),
    isExtended: false
  }


  componentDidMount(): void {
    this.fetchAll()
  }

  fetchAll = () => {
    this.fetchRecentActions()
    this.fetchDoughnutCharts()
    this.fetchIncomesOfYears()
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
      .then((response: { profitPerDays: Array<[number, number]> }) => {
        let toState = this.mapToChart(response.profitPerDays)
        this.setState({
          profitPerDays: toState
        })
      })
  }

  fetchIncomePerDays = async () => {
    await get('get-income-per-days', {
      dateFrom: this.state.dateFrom.getTime(),
      dateTo: this.state.dateTo.getTime(),
      email: user().email
    })
      .then((response: { incomePerDays: Array<[number, number]> }) => {
        let toState = this.mapToChart(response.incomePerDays)
        this.setState({
          incomePerDays: toState
        })
      })
  }

  mapToChart = (source: Array<[number, number]>): Array<[number, string]> => {
    let result = Array<[number, string]>()
    if (source)
    for (let data of source) {
      result.push([data[0], data[1].toString()])
    }
    return result
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

  fetchIncomesOfYears = async () => {
    await get('get-incomes-of-years', {email: user().email})
      .then((response: { success: boolean, message: string, incomes: Array<[number, string]> }) => {
        if (response.success) {
          this.setState({
            incomesOfYears: this.mapSqlObjectToChartData('product_income', 'year', response.incomes)
          })
        } else message.error(response.message)
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

  setTimeRange = (from: Date, to: Date) => {
    this.setState({
      dateFrom: from,
      dateTo: to
    })
    this.fetchMonthlyDashBoardItems()
  }

  mapSqlObjectToChartData = (key1: string, key2: string, sqlObj: Array<any>): Array<[number, string]> => {
    let result = Array<[number, string]>()
    for (let obj of sqlObj) {
      result.push([
        obj[key1],
        obj[key2] + ''
      ])
    }
    return result
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
        text: i18n('dashboard.charts.monthly.productProfit')
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

    return <div>
      <PageTitle title={i18n('dashboard.title')}/>
      <Tabs type="card">
        <TabPane tab={<div><Icon type="pie-chart"/>{i18n('tabs.overview')}</div>} key={"1"}>
         <OverviewTab/>
        </TabPane>
        <TabPane tab={<div><Icon type="bar-chart"/>{i18n('tabs.monthly')}</div>} key="2">

          <TimeRangeSwitcher returnRange={this.setTimeRange}/>

          <Row type={"flex"} justify={"space-around"}>
            <div style={chartStyle}>
              <BarChart
                data={this.state.profitPerDays}
                height={300}
                width={window.innerWidth * 0.8}
                type={'BAR'}
                title={i18n('dashboard.charts.monthly.titleProfit')}/>
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
                title={i18n('dashboard.charts.monthly.titleInc')}/>
            </div>
          </Row>
          <Row type={"flex"} justify={"space-around"}>
            <div style={monthlyCharts}>
              <Bar data={this.state.profitOfCats}
                   options={chartOptions}
                   height={300}
                   width={window.innerWidth * 0.8}/>
            </div>
          </Row>
        </TabPane>

        <TabPane tab={<div><Icon type="rise"/>{i18n('tabs.annual')}</div>} key="3">
          <AnnualDashboardTab/>
        </TabPane>
      </Tabs>

    </div>
  }
}

export default DashboardPage;
