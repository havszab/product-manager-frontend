import React from "react";
import EmployeeForm from "../components/forms/EmployeeForm";
import EmployeeCard from "../components/EmployeeCard";
import {Row, Tabs, Modal, Button} from "antd";
import PageTitle from "../components/PageTitle";
import {user} from "../libs/utils/user";
import {get} from "../libs/utils/request";

const TabPane = Tabs.TabPane;

type props = {}
type state = {
  isCreating: boolean
  employees: Array<Employee>
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

class AdminPage extends React.Component<props, state> {
  state = {
    isCreating: false,
    employees: Array<Employee>()
  }

  componentDidMount(): void {
    this.fetchEmployees()
  }

  createEmployeeHandler = () => {
    this.setState({
      isCreating: true
    })
  }

  modalCancelHandler = () =>{
    this.fetchEmployees()
    this.setState({
      isCreating: false
    })
  }

  modalSubmitHandler = () => {
    this.fetchEmployees()
    this.setState({
      isCreating: false
    })
  }

  fetchEmployees = async () => {
    await get('get-employees', {email: user().email})
      .then((response: {employees: Array<Employee>}) => {
        this.setState({
          employees: response.employees
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

  render() {

    const createEmployee = this.state.isCreating ? (
      <Modal visible={this.state.isCreating}
             footer={null}
             centered={true}
             onCancel={this.modalCancelHandler}>
          <EmployeeForm onSuccess={this.modalSubmitHandler} onCancel={this.modalCancelHandler}/>
      </Modal>) : null

    return <div>
      <Tabs type="card">
        <TabPane tab="Manage Employees" key="1">
          {createEmployee}
          <PageTitle title={'Manage employees'}/>
          <Row type={"flex"} justify={"space-around"}>
            <Button onClick={this.createEmployeeHandler} type={'primary'}>Add employee</Button>
          </Row>
          <Row type={"flex"} justify={"space-around"}>
            {this.renderEmployees()}
          </Row>
        </TabPane>
        <TabPane tab="Manage Costs" key="2"><PageTitle title={'Manage costs'}/></TabPane>
        <TabPane tab="Settings" key="3"><PageTitle title={'Settings'}/></TabPane>
      </Tabs>
    </div>
  }
}

export default AdminPage;
