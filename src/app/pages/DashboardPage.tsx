import * as React from "react";
import {Component} from "react";
import {Timeline, Icon} from "antd";
import {get} from "../libs/utils/request";
import {user} from "../libs/utils/user";
import Row from "antd/lib/grid/row";
import {Bar} from "react-chartjs-2"
import PageTitle from "../components/PageTitle";
import Button from "antd/lib/button";

type props = {}

type state = {
  actions?: Array<Action>
  profitOfCats?: ChartData
  selectedMonth?: Date
}

interface Action {
  date: Date
  name: string
  color: string
}

interface Response {
  actions: Array<Action>
}

interface ProfitByCat {
  profitsByCategories: [[number, string]]
}

interface ChartData {
  datasets: [
    {
      '_meta'?: {}
      data: number[]
      backgroundColor?: string
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
      datasets: [{ _meta?: {}; data: number[]; backgroundColor?: string; borderColor?: string; borderWidth?: number; hoverBackgroundColor?: string; hoverBorderColor?: string; label?: string }];
      labels: any[];
    },
    selectedMonth: new Date()
  }


  componentDidMount(): void {
    this.fetchRecentActions()
    this.fetchDasboardItems()
  }

  fetchRecentActions = async () => {
    await get(`get-recent-actions?email=${user().email}`)
      .then((response: Response) => {
        this.setState({
          actions: response.actions,
        })
      })
  }

  fetchDasboardItems = async () => {
    let values = []
    let labels = []
    let resp: ProfitByCat;
    await get('get-profit')
      .then((response: ProfitByCat) => {
        resp = response
      })
    for (let cat of resp.profitsByCategories) {
      values.push(cat[0])
      labels.push(cat[1])
    }
    let data: ChartData = {
      datasets: [
        {
          data: values,
          label: 'profit',
          backgroundColor: '#b98f71',
          borderColor: '#a26a42',
          borderWidth: 1,
          hoverBackgroundColor: '#dcc7b8',
          hoverBorderColor: '#d0b4a0'
        }
      ],
      labels: labels
    }
    this.setState({
      profitOfCats: data
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

  handlePreviousMonth = () => {
    let date: Date = new Date(this.state.selectedMonth)
    date.setMonth( this.state.selectedMonth.getMonth() -1)
    this.setState({
      selectedMonth: date
    })
  }
  handleNextMonth = () => {
    let date: Date = new Date(this.state.selectedMonth)
    date.setMonth( this.state.selectedMonth.getMonth() + 1)
    this.setState({
      selectedMonth: date
    })
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

    const currentDate = new Date()

    return <div>
      <PageTitle title={'Dashboard'}/>
      <Row type={"flex"} justify={"space-around"}>
        <div style={{border: '1px solid #ccc', borderRadius: 7, padding: '30px 15px 0px 15px', maxWidth: '40%'}}>
          <Row type={"flex"} justify={"space-around"}>
            <h2 style={{borderBottom: '1px solid #ccc', width: '100%', marginBottom: 30}}>Recent actions</h2>
          </Row>
          <Timeline>
            {this.renderTimeLineItems()}
          </Timeline>
        </div>
        <div >
          <Button onClick={this.handlePreviousMonth}><Icon type="left" /></Button>
          <div style={{padding: 10, border: '1px solid #ccc', borderRadius: 7, backgroundColor: '#fff'}}>
          {`${this.state.selectedMonth.getFullYear()}. ${this.state.selectedMonth.getMonth()+1<9? '0':''}${this.state.selectedMonth.getMonth()+1}`}
          </div>
          <Button onClick={this.handleNextMonth} disabled={this.state.selectedMonth === currentDate}><Icon type="right" /></Button>
        </div>
        <div style={{width: 600, height: 300, border: '1px solid #ccc', borderRadius: 7, paddingBottom: 0}}>
          <Bar data={this.state.profitOfCats} options={chartOptions}/>

        </div>
      </Row>
    </div>
  }
}

export default DashboardPage;
