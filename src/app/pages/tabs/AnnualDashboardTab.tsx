import React from "react";
import {Button, Card, Col, Icon, message, Row, Statistic, Table, Tooltip} from "antd";
import {get} from "../../libs/utils/request";
import {user} from "../../libs/utils/user";
import Chart from "../../components/charts/Chart";

type props = {}
type state = {
  selectedYear: number
  productCosts: number
  income: number
  costs: Array<{ name: string, amount: number }>
  indirectCosts: number
}

const currency = 'HUF'

const statisticHeaderStyle = {fontSize: '1.5em', fontWeight: 'bold' as 'bold'}

const statisticCardStyle = {margin: '10px 0px'}

class AnnualDashboardTab extends React.Component<props, state> {
  state = {
    selectedYear: new Date().getFullYear(),
    productCosts: 0,
    income: 0,
    costs: Array<{ name: string, amount: number }>(),
    indirectCosts: 0
  }

  componentDidMount(): void {
    this.fetchAll()
  }

  fetchAll = async () => {
    await this.fetchCosts()
    await this.fetchIncome()
    await this.fetchProductCosts()
  }

  changeSelectedYear = async (num: number) => {
    const prevState = {...this.state}
    const selectedYear = prevState.selectedYear
    await this.setState({
      selectedYear: selectedYear + num
    })
    await this.fetchAll()
  }

  isBtnDisabled = (): boolean => {
    const prevState = {...this.state}
    return prevState.selectedYear >= new Date().getFullYear()
  }

  mapCostsToChartData = (): Array<[number, string]> => {
    let result = Array<[number, string]>()
    let prevState = {...this.state}
    for (let cost of prevState.costs) {
      result.push([
        cost.amount,
        cost.name
      ])
    }
    return result
  }

  fetchProductCosts = async () => {
    await get('get-product-costs', {year: this.state.selectedYear, email: user().email})
      .then((response: { success: boolean, message: string, productCostSum: { product_costs: number } }) => {
        if (response.success) {
          this.setState({
            productCosts: response.productCostSum.product_costs
          })

        } else message.error(response.message)
      })
      .catch(err => {
        message.error(err)
      })
  }

  fetchIncome = async () => {
    await get('get-income', {year: this.state.selectedYear, email: user().email})
      .then((response: { success: boolean, message: string, income: { product_income: number } }) => {
        if (response.success) {
          this.setState({
            income: response.income.product_income
          })
        } else message.error(response.message)
      })
      .catch(err => {
        message.error(err)
      })
  }

  fetchCosts = async () => {
    await get('get-cost-amounts', {year: this.state.selectedYear, email: user().email})
      .then((response: { success: boolean, message: string, costs: Array<{ name: string, amount: number }> }) => {
        if (response.success) {
          this.setState({
            costs: response.costs
          })
          let indirectCosts = 0

          for (let cost of response.costs) {
            indirectCosts += cost.amount
          }

          this.setState({
            indirectCosts: indirectCosts
          })

        } else message.error(response.message)
      })
      .catch(err => {
        message.error(err)
      })
  }

  getGrossProfit = (): number => {
    const prevState = {...this.state}
    return prevState.income - prevState.productCosts ? prevState.income - prevState.productCosts : 0
  }

  getProdCostGrossProfitData = (): Array<[number, string]> => {
    let result = Array<[number, string]>()
    const prevState = {...this.state}
    const sum = prevState.productCosts + this.getGrossProfit()
    result.push([
      prevState.productCosts / sum * 100, 'Cost of sales [%]'
    ])
    result.push([
      this.getGrossProfit() / sum * 100, 'Gross margin [%]'
    ])
    return result
  }

  getAccountingChartData = (): Array<[number, string]> => {
    let result = Array<[number, string]>()
    const prevState = {...this.state}
    const sum = prevState.productCosts + prevState.indirectCosts + prevState.income - (prevState.productCosts + prevState.indirectCosts)
    result.push([
      prevState.productCosts / sum * 100, 'Accounting cost: Cost of sales [%]'
    ])
    result.push([
      prevState.indirectCosts / sum * 100, 'Accounting cost: Operating expenses [%]'
    ])
    result.push([
      (prevState.income - (prevState.productCosts + prevState.indirectCosts)) / sum * 100, 'Accounting profit [%]'
    ])
    return result
  }

  initData = (): Array<{ name: string, amount: number }> => {
    let indirectCosts = 0
    const data: Array<{ name: string, amount: number }> = []
    const state = {...this.state}
    for (let cost of state.costs) {
      data.push(cost)
      indirectCosts += cost.amount
    }
    return data
  }

  renderCosts = (): React.ReactNode => {
    let costCards: React.ReactNode[] = []
    let indirectCosts = 0

    const state = {...this.state}
    for (let cost of state.costs) {
      indirectCosts += cost.amount
    }

    costCards.push(
      <div style={statisticCardStyle} key={1}>
        <Col span={12}>
          <Card style={{margin: '5px 0px'}}>
            <Statistic
              title={
                <div style={statisticHeaderStyle}><Tooltip title={'All the expenses excluding cost of sales.'}>
                  <span><Icon type="info-circle" theme="twoTone" style={{fontSize: '0.7em', marginRight: 8}}/></span>
                </Tooltip>Operating expenses</div>
              }
              value={indirectCosts}
              precision={1}
              valueStyle={{color: '#f5222d'}}
              prefix={<Icon type="swap-left"/>}
              suffix={currency}
            />
          </Card>
        </Col>
      </div>
    )
    costCards.push(
      <div style={statisticCardStyle} key={2}>
        <Col span={12}>
          <Card style={{margin: '5px 0px'}}>
            <Statistic
              title={
                <div style={statisticHeaderStyle}><Tooltip title={'Sum of operating expenses and cost of sales.'}>
                  <span><Icon type="info-circle" theme="twoTone" style={{fontSize: '0.7em', marginRight: 8}}/></span>
                </Tooltip>Accounting costs</div>
              }
              value={indirectCosts + state.productCosts ? indirectCosts + state.productCosts : 0}
              precision={1}
              valueStyle={{color: '#f5222d'}}
              prefix={<Icon type="swap-left"/>}
              suffix={currency}
            />
          </Card>
        </Col>
      </div>
    )
    costCards.push(
      <div style={statisticCardStyle} key={3}>
        <Col span={12}>
          <Card style={{margin: '5px 0px'}}>
            <Statistic
              title={
                <div style={statisticHeaderStyle}><Tooltip title={'Gross margin - operating expenses'}>
                  <span><Icon type="info-circle" theme="twoTone" style={{fontSize: '0.7em', marginRight: 8}}/></span>
                </Tooltip>Operating income</div>
              }
              value={this.getGrossProfit() - indirectCosts}
              precision={1}
              valueStyle={{color: this.getGrossProfit() - indirectCosts > 0 ? '#3f8600' : '#f5222d'}}
              prefix={<Icon type="swap"/>}
              suffix={currency}
            />
          </Card>
        </Col>
      </div>
    )
    return costCards
  }


  render() {

    const data = this.initData()

    const cols = [
      {
        title: 'Denomination',
        dataIndex: 'name',
      }, {
        title: 'Amount',
        dataIndex: 'amount',
        render: (value: string, data: { name: string, amount: number }) => (
          `${data.amount.toLocaleString()} ${currency}`)
      }
    ]

    const leftBtnStyle = {
      fontSize: '3em',
      margin: 5,
      paddingBottom: 55,
      position: 'fixed' as 'fixed',
      color: '#1890ff',
      left: '10%',
      top: '50%'
    }
    const rightBtnStyle = {
      fontSize: '3em',
      margin: 5,
      paddingBottom: 55,
      position: 'fixed' as 'fixed',
      color: !this.isBtnDisabled ? '#ccc' : '#1890ff',
      right: '3%',
      top: '50%'
    }

    return (
      <div>
        <Row type={'flex'} justify={'space-around'}>
          <Row type={'flex'} justify={'space-around'}
               style={{
                 width: 100,
                 border: '1px solid #1890ff',
                 borderRadius: 30,
                 padding: 5,
                 margin: 10,
                 backgroundColor: 'rgb(24,144,255, 0.4)'
               }}>
            <Button style={leftBtnStyle} size={'large'} onClick={() => this.changeSelectedYear(-1)}>
              <Icon type="left"/>
            </Button>
            <div style={{
              padding: '6px 10px 2px 10px',
              border: '1px solid #1890ff',
              borderRadius: 4,
              margin: 3,
              fontWeight: 'bold',
              fontSize: '1.2em',
              backgroundColor: '#fff'
            }}>{this.state.selectedYear}</div>
            <Button style={rightBtnStyle} size={'large'} onClick={() => this.changeSelectedYear(1)}
                    disabled={this.isBtnDisabled()}>
              <Icon type={'right'}/>
            </Button>
          </Row>
        </Row>

        <Row type={'flex'} justify={'space-around'}>
          <Row gutter={16}
               align={'middle'}
               style={{border: '1px solid #1890ff', paddingBottom: 10, borderRadius: 4, margin: 10, width: '80%'}}>
            <div style={statisticCardStyle}>
              <Col span={8}>
                <Card>
                  <Statistic
                    title={
                      <div style={statisticHeaderStyle}><Tooltip title={'Sum of the amount of sold products.'}>
                        <span><Icon type="info-circle" theme="twoTone"
                                    style={{fontSize: '0.7em', marginRight: 8}}/></span>
                      </Tooltip>Net sales</div>
                    }
                    value={this.state.income}
                    precision={1}
                    valueStyle={{color: '#3f8600'}}
                    prefix={<Icon type="swap-right"/>}
                    suffix={currency}
                  />
                </Card>
              </Col>
            </div>

            <div style={statisticCardStyle}>
              <Col span={8}>
                <Card>

                  <Statistic
                    title={
                      <div style={statisticHeaderStyle}><Tooltip
                        title={'Sum of the costs spent for product acquisitions.'}>
                        <span><Icon type="info-circle" theme="twoTone"
                                    style={{fontSize: '0.7em', marginRight: 8}}/></span>
                      </Tooltip>Cost of sales</div>
                    }
                    value={this.state.productCosts}
                    precision={1}
                    valueStyle={{color: '#f5222d'}}
                    prefix={<Icon type="swap-left"/>}
                    suffix={currency}
                  />

                </Card>
              </Col>
            </div>

            <div style={statisticCardStyle}>
              <Col span={8}>
                <Card>
                  <Statistic
                    title={
                      <div style={statisticHeaderStyle}><Tooltip title={'Net sales - cost of sales.'}>
                        <span><Icon type="info-circle" theme="twoTone"
                                    style={{fontSize: '0.7em', marginRight: 8}}/></span>
                      </Tooltip>Gross margin</div>
                    }
                    value={this.getGrossProfit()}
                    precision={1}
                    valueStyle={{color: this.getGrossProfit() > 0 ? '#3f8600' : '#f5222d'}}
                    prefix={<Icon type="swap"/>}
                    suffix={currency}
                  />
                </Card>
              </Col>
            </div>
          </Row>
        </Row>

        <Row type={'flex'} justify={'space-around'}>
          <Row gutter={16}
               align={'middle'}
               style={{border: '1px solid #1890ff', paddingBottom: 10, borderRadius: 4, margin: 10, width: '80%'}}>
            <Col span={12} style={{marginTop: 10}}>
              <Card style={{margin: '5px 0px'}}>
                <div>
                  <Table columns={cols}
                         dataSource={data}
                         pagination={false}
                         size={'small'}
                         bordered={true}
                         rowKey={record => {
                           return record.name
                         }}
                  />
                </div>
              </Card>
            </Col>
            {this.renderCosts()}
          </Row>
        </Row>

        <Row type={'flex'} justify={'space-around'}>
          <Row gutter={16}
               align={'middle'}
               style={{border: '1px solid #1890ff', paddingBottom: 10, borderRadius: 4, margin: 10, width: '80%'}}>

            <Col span={9} offset={2}>
              <Chart title={`Ratio of cost of sales in ${this.state.selectedYear}`}
                     data={this.getProdCostGrossProfitData()}
                     height={200} width={200} type={'DOUGHNUT'}/>
            </Col>
            <Col span={10} offset={1}>
              <Chart title={`Ratio of operating expenses in ${this.state.selectedYear}`}
                     data={this.getAccountingChartData()}
                     height={200} width={200} type={'DOUGHNUT'}
                     colors={['rgb(255,34,45, 1)', 'rgb(255,34,45, 0.6)', '#3f8600']}/>
            </Col>
          </Row>
          <Row gutter={16}
               align={'middle'}
               style={{border: '1px solid #1890ff', paddingBottom: 10, borderRadius: 4, margin: 10, width: '80%'}}>
            <Col span={10} offset={1}>
              <Chart title={`Expenses in ${this.state.selectedYear}`} data={this.mapCostsToChartData()}
                     height={200} width={200} type={'PIE'}/>
            </Col>
          </Row>
        </Row>
      </div>
    )
  }

}

export default AnnualDashboardTab;
