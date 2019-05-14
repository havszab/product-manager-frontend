import React from "react";
import {get} from "../../libs/utils/request";
import {user} from "../../libs/utils/user";
import {Modal, Row} from "antd";
import EmployeeForm from "../../components/forms/EmployeeForm";
import PageTitle from "../../components/utils/PageTitle";
import UtilButton from "../../components/utils/UtilButton";
import EmployeeCard from "../../components/cards/EmployeeCard";

type props = {}
type state = {
  isModalVisible: boolean
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


class EmployeeTab extends React.Component<props, state> {
  state = {
    isModalVisible: false,
    employees: Array<Employee>()
  }

  componentDidMount(): void {
    this.fetchAll()
  }

  fetchAll = () => {
    this.fetchEmployees()
  }

  fetchEmployees = async () => {
    await get('get-employees', {email: user().email})
      .then((response: { employees: Array<Employee> }) => {
        this.setState({
          employees: response.employees
        })
      })
  }

  renderEmployees = (): React.ReactNode => {
    let employees = []
    for (let emp of this.state.employees) {
      employees.push(<EmployeeCard onSuccess={() => this.isModalVisibleSwitchHandler(false, true)} employee={emp} key={emp.id}/>)
    }
    return employees
  }

  isModalVisibleSwitchHandler = (isVisible: boolean, reFetch?: boolean) => {
    this.setState({
      isModalVisible: isVisible
    })
    if (reFetch) this.fetchAll()
  }

  render() {

    const modalForm = <Modal visible={this.state.isModalVisible}
                               closable={false}
                               footer={null}
                               centered={true}
                               onCancel={() => this.isModalVisibleSwitchHandler(false)}>
      <EmployeeForm onSuccess={() => this.isModalVisibleSwitchHandler(false, true)}
                    onCancel={() => this.isModalVisibleSwitchHandler(false)}/>
    </Modal>

    return (
      <div>
        <UtilButton tooltip={'New employee'} onClick={() => this.isModalVisibleSwitchHandler(true)}/>
        {modalForm}
        <Row type={"flex"} justify={"space-around"}>
          {this.renderEmployees()}
        </Row>
      </div>
    )
  }

}

export default EmployeeTab;
