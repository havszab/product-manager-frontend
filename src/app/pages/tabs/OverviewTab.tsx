import React from "react";
import {get} from "../../libs/utils/request";
import {user} from "../../libs/utils/user";
import {Button, Icon, message, Timeline, Row, Card, Statistic, Tooltip, Col} from "antd";
import Chart from "../../components/charts/Chart";

type props = {}
type state = {
  actions: Array<Action>
  profitPercent?: Array<[number, string]>
  incomesOfYears: Array<[number, string]>
  profitsOfYears: Array<[number, string]>
  top5Annual: Array<[number, string]>
  top5Monthly: Array<[number, string]>
  top5Weekly: Array<[number, string]>
  top5Other: Array<[number, string]>
  employeesCount: number
  soldProductsCount: number
  sumIncomes: number
  isExtended: boolean
}

interface Action {
  date: Date
  name: string
  color: string
}

const statisticHeaderStyle = {fontSize: '1.5em', fontWeight: 'bold' as 'bold'}

class OverviewTab extends React.Component<props, state> {
  state = {
    actions: Array<Action>(),
    profitPercent: Array<[number, string]>(),
    incomesOfYears: Array<[number, string]>(),
    profitsOfYears: Array<[number, string]>(),
    top5Annual: Array<[number, string]>(),
    top5Monthly: Array<[number, string]>(),
    top5Weekly: Array<[number, string]>(),
    top5Other: Array<[number, string]>(),
    employeesCount: 0,
    soldProductsCount: 0,
    sumIncomes: 0,
    isExtended: false
  }

  componentDidMount(): void {
    this.fetchAll()
  }

  fetchAll = async () => {
    await this.fetchRecentActions()
    await this.fetchIncomesOfYears()
    await this.fetchProfitsOfYears()
    await this.fetchProfitPercent()
    await this.fetchTop5AnnualCost()
    await this.fetchTop5MonthlyCost()
    await this.fetchTop5WeeklyCost()
    await this.fetchTop5OtherCost()
    await this.fetchEmployeesCount()
    await this.fetchSoldProductsCount()
  }

  fetchRecentActions = async () => {
    await get('get-recent-5-actions', {email: user().email})
      .then((response: { actions: Array<Action> }) => {
        this.setState({
          actions: response.actions,
          isExtended: false
        })
      })
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
      .then(() => {
        let prevState = {...this.state}
        let sum = 0
        for (let inc of prevState.incomesOfYears) {
          sum += inc[0]
        }
        this.setState({
          sumIncomes: sum
        })
      })
  }

  fetchEmployeesCount = async () => {
    await get('get-employees', {email: user().email})
      .then((response: { success: boolean, message: string, employees: Array<{}> }) => {
        if (response.success) {
          this.setState({
            employeesCount: response.employees.length
          })
        } else message.error(response.message)
      })
  }

  fetchSoldProductsCount = async () => {
    await get('get-sold-products-count', {email: user().email})
      .then((response: { success: boolean, message: string, result: { count: number } }) => {
        if (response.success) {
          this.setState({
            soldProductsCount: response.result.count
          })
        } else message.error(response.message)
      })
  }

  fetchProfitsOfYears = async () => {
    await get('get-profits-of-years', {email: user().email})
      .then((response: { success: boolean, message: string, profits: Array<[number, string]> }) => {
        if (response.success) {
          this.setState({
            profitsOfYears: this.mapSqlObjectToChartData('profit', 'year', response.profits)
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

  getColors = (color: string, length: number): Array<string> => {
    let colors = Array<string>()
    for (let i = 0; i < length; i++) {
      colors.push(color)
    }
    return colors
  }

  extendActionsHandler = async () => {
    await get('get-recent-10-actions', {email: user().email})
      .then((response: { actions: Array<Action> }) => {
        this.setState({
          actions: response.actions,
          isExtended: true
        })
      })
  }

  collapseActionsHandler = () => {
    this.fetchRecentActions()
  }

  render() {
    const btnStyle = {fontSize: '1em', padding: '0px 8px', margin: 5}

    const toggleActionsButton = !this.state.isExtended ?
      <Button shape={'round'} type={'primary'} onClick={this.extendActionsHandler} style={btnStyle}><Icon type="down"/></Button> :
      <Button shape={'round'} type={'primary'} onClick={this.collapseActionsHandler} style={btnStyle}><Icon type="up"/></Button>

    const widgetStyle = {
      border: '1px solid #ccc',
      borderRadius: 7,
      paddingBottom: 0,
      //margin: 5,
      //maxHeight: 350,
      backgroundColor: '#F2F2FF'
    }

    const costChartHeight = 300
    const costChartWidth = 250

    const colorSet1 = ["#FF6384", "#4BC0C0", "#FFCE56", "#E7E9ED", "#36A2EB"]
    const blueColorSet = ['#1ec0ff', '#a3daff', '#0080ff', '#03a6ff', '#00dffc']

    return (
      <div>
        <Row type={"flex"} justify={"space-around"} style={{marginBottom: 30}} gutter={16}>
          <Col span={10}>
          <Card>
            <Row type={"flex"} justify={"space-around"}>
              <h2 style={{borderBottom: '1px solid #ccc', width: '100%', marginBottom: 30}}>Recent actions</h2>
            </Row>
            <Timeline>
              {this.renderTimeLineItems()}
            </Timeline>
            <Row type={"flex"} justify={"space-around"}>
              {toggleActionsButton}
            </Row>
          </Card>
          </Col>
<Col span={14}>
          <Card >
            <Chart data={this.state.incomesOfYears}
                   height={400}
                   width={600}
                   title={'Incomes of years'}
                   type={'BAR'}
                   label={'Income [million HUF]'}
                   colors={this.getColors('#52c41a', this.state.incomesOfYears.length)}
                   toMillion={true}
            />

          </Card>
</Col>
        </Row>


        <Row gutter={8} style={{marginBottom: 20}} type={"flex"} justify={"space-around"}>
          <Col span={6}>
            <div>
              <Card>
                <Chart data={this.state.profitPercent}
                       height={355}
                       width={290}
                       title={'Top 5 product\'s profit portion'}
                       type={'DOUGHNUT'}
                       colors={colorSet1}

                />
              </Card>
            </div>
          </Col>
          <Col span={12}>
            <div>
              <Card>
                <Chart data={this.state.profitsOfYears}
                       height={350}
                       width={500}
                       title={'Gross profits earned yearly'}
                       type={'BAR'}
                       colors={this.getColors("#FFCE56", this.state.profitsOfYears.length)}
                       label={'Profit [million HUF]'}
                       toMillion={true}
                />
              </Card>
            </div>
          </Col>

          <Col span={6}>
            <div>
              <Card>
                <Statistic
                  title={
                    <div style={statisticHeaderStyle}><Tooltip title={'Number of deals made since the beginnings'}>
                        <span><Icon type="info-circle" theme="twoTone"
                                    style={{fontSize: '0.7em', marginRight: 8}}/></span>
                    </Tooltip>Deals</div>
                  }
                  value={this.state.soldProductsCount.toLocaleString()}
                  precision={0}
                  valueStyle={{color: '#3f8600'}}
                  prefix={<Icon type="sync"/>}
                />
              </Card>

              <Card style={{marginTop: 10, marginBottom: 10}}>
                <Statistic
                  title={
                    <div style={statisticHeaderStyle}><Tooltip title={'Current number of employees'}>
                        <span><Icon type="info-circle" theme="twoTone"
                                    style={{fontSize: '0.7em', marginRight: 8}}/></span>
                    </Tooltip>Employees</div>
                  }
                  value={this.state.employeesCount}
                  precision={0}
                  valueStyle={{color: '#3f8600'}}
                  prefix={<Icon type="team"/>}
                  suffix={''}
                />
              </Card>

              <Card>
                <Statistic
                  title={
                    <div style={statisticHeaderStyle}><Tooltip
                      title={'All the incomes earned from the first year to the last'}>
                        <span><Icon type="info-circle" theme="twoTone"
                                    style={{fontSize: '0.7em', marginRight: 8}}/></span>
                    </Tooltip>Historical income</div>
                  }
                  value={this.state.sumIncomes.toLocaleString()}
                  precision={0}
                  valueStyle={{color: '#3f8600'}}
                  prefix={<Icon type="dollar"/>}
                  suffix={'HUF'}
                />
              </Card>
            </div>
          </Col>
        </Row>

        <Row gutter={16} type={"flex"} justify={"space-around"}>
          <Col span={6}>
            <Card>
              <Chart data={this.state.top5Annual}
                     height={costChartHeight}
                     width={costChartWidth} type={'PIE'} title={'The 5 highest annual costs'}
                     colors={blueColorSet}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Chart data={this.state.top5Monthly}
                     height={costChartHeight}
                     width={costChartWidth} type={'PIE'} title={'The 5 highest monthly costs'}
                     colors={blueColorSet}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Chart data={this.state.top5Weekly}
                     height={costChartHeight}
                     width={costChartWidth} type={'PIE'} title={'The 5 highest weekly costs'}
                     colors={blueColorSet}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Chart data={this.state.top5Other}
                     height={costChartHeight} width={costChartWidth}
                     type={'PIE'} title={'The 5 highest other costs'}
                     colors={blueColorSet}
              />
            </Card>
          </Col>
        </Row>
      </div>
    )
  }

}

export default OverviewTab;
