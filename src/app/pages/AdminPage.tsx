import React from "react"
import EmployeeForm from "../components/forms/EmployeeForm"
import EmployeeCard from "../components/cards/EmployeeCard"
import {Row, Tabs, Modal, Button, Icon, Tooltip} from "antd"
import PageTitle from "../components/utils/PageTitle"
import {user} from "../libs/utils/user"
import {get} from "../libs/utils/request"
import CostCard from "../components/cards/CostCard"
import CostForm from "../components/forms/CostForm"
import CostWidgets from "../components/utils/CostWidgets";
import AdministrationTab from "./tabs/AdministrationTab";

const TabPane = Tabs.TabPane;

type props = {}
type state = {
  isCreating: boolean
  employees: Array<Employee>
  isCostCreating: boolean
  costs: Array<Cost>
  sums: Array<[number, string]>
}

interface Employee {
  id: number
  email: string
  firstName: string
  lastName: string
  phone: string
  position: string
  salary: number
  ownerEmail: string
}

interface Cost {
  id: number
  name: string
  cost: number
  payedLastDate: Date
  type: string
}

class AdminPage extends React.Component<props, state> {
  state = {
    isCreating: false,
    employees: Array<Employee>(),
    isCostCreating: false,
    costs: Array<Cost>(),
    sums: Array<[number, string]>()
  }

  async componentDidMount(): Promise<void> {
    await this.fetchEmployees()
    await this.fetchCosts()
    await this.fetchStatistics()
  }

  createEmployeeHandler = () => {
    this.setState({
      isCreating: true
    })
  }

  createCostHandler = () => {
    this.setState({
      isCostCreating: true
    })
  }

  modalCancelHandler = () => {
    this.setState({
      isCreating: false
    })
  }

  modalSubmitHandler = () => {
    this.fetchEmployees()
    this.fetchCosts()
    this.fetchStatistics()
    this.setState({
      isCreating: false
    })
  }

  costModalCancelHandler = () => {
    this.setState({
      isCostCreating: false
    })
  }

  costModalSubmitHandler = () => {
    this.fetchCosts()
    this.fetchStatistics()
    this.setState({
      isCostCreating: false
    })
  }

  fetchEmployees = async () => {
    await get('get-employees', {email: user().email})
      .then((response: { employees: Array<Employee> }) => {
        this.setState({
          employees: response.employees
        })
      })
  }

  fetchCosts = async () => {
    await get('get-costs', {email: user().email})
      .then((response: {costs: Array<Cost>}) => {
        this.setState({
          costs: response.costs
        })
      })
  }

  fetchStatistics = async  () => {
    await get('get-cost-sums-by-type', {email: user().email})
      .then((response: {sums: Array<[number, string]>}) => {
        this.setState({
          sums: response.sums
        })
      })
  }


  renderEmployees = (): React.ReactNode => {
    let employees = []
    for (let emp of this.state.employees) {
      employees.push(<EmployeeCard employee={emp} key={emp.id}/>)
    }
    return employees
  }

  renderCosts = (): React.ReactNode => {
    let costs = []
    for (let cost of this.state.costs) {
      costs.push(<CostCard onSuccess={this.fetchCosts} cost={cost} key={cost.id}/>)
    }
    return costs
  }


  render() {

    const createEmployee = this.state.isCreating ? (
      <Modal visible={this.state.isCreating}
             footer={null}
             centered={true}
             onCancel={this.modalCancelHandler}>
        <EmployeeForm onSuccess={this.modalSubmitHandler} onCancel={this.modalCancelHandler}/>
      </Modal>) : null

    const createCost = this.state.isCostCreating ? (
      <Modal visible={this.state.isCostCreating}
             footer={null}
             centered={true}
             onCancel={this.costModalCancelHandler}
             style={{maxWidth: 300}}>
        <Row type={"flex"} justify={"space-around"}>
          <CostForm onSuccess={this.costModalSubmitHandler} onCancel={this.costModalCancelHandler}/>
        </Row>
      </Modal>) : null

    return <div>
      <Tabs type="card">
        <TabPane tab={<div><Icon type="idcard"/>Manage Employees</div>} key="1">
          {createEmployee}
          <PageTitle title={'Manage employees'}/>
          <Row type={"flex"} justify={"space-between"}>
            <Tooltip placement="topLeft" title="New employee">
              <Button onClick={this.createEmployeeHandler} shape={'circle'} type={'primary'}>+</Button>
            </Tooltip>
          </Row>
          <Row type={"flex"} justify={"space-around"}>
            {this.renderEmployees()}
          </Row>
        </TabPane>
        <TabPane tab={<div><Icon type="schedule"/> Manage Costs</div>} key="2"><PageTitle title={'Manage costs'}/>
          <Row type={"flex"} justify={"space-between"}>
            <Tooltip placement="topLeft" title="New cost">
              <Button onClick={this.createCostHandler} shape={'circle'} type={'primary'}>+</Button>
            </Tooltip>
          </Row>
          <CostWidgets sums={this.state.sums}/>
          {createCost}
          <Row type={"flex"} justify={"space-around"}>
            {this.renderCosts()}
          </Row>
        </TabPane>
        <TabPane tab={<div><Icon type="setting"/>Settings</div>} key="3"><PageTitle title={'Settings'}/><AdministrationTab /></TabPane>
      </Tabs>
    </div>
  }
}

export default AdminPage;
