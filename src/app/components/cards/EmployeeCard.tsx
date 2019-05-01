import React from "react";
import {Card, Row, Avatar, Icon, Popconfirm} from "antd";
import EmployeeForm from "../forms/EmployeeForm";

type props = {
  employee: Employee
  onSuccess: () => void
}
type state = {
  isEditing?: boolean
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

class EmployeeCard extends React.Component<props, state> {
  state = {
    isEditing: false
  }

  setIsEditing = (isEditing: boolean, isSuccess?: boolean) => {
    this.setState({
      isEditing: isEditing
    })
    if (isSuccess) this.props.onSuccess()
  }

  render() {

    const {employee} = this.props

    const infoColumnStyle = {width: 180, margin: 10}

    const employeeCard = !this.state.isEditing ? (
      <Card style={{width: 450, marginTop: 16}} actions={[<Icon type="edit" onClick={() => this.setIsEditing(true)}/>, <Popconfirm title={'Do you want to remove employee?'}><Icon type="delete"/></Popconfirm>]}>
        <Row type={"flex"} justify={"space-between"} style={{borderBottom: '1px solid #ccc'}}>
          <Avatar size={64} shape={'square'} icon="user"/>
          <div style={{width: 250, marginTop: 20, marginBottom: 20, fontSize: '1.4em', fontWeight: 'bold'}}>
            {employee.firstName} {employee.lastName}
          </div>
        </Row>
        <Row type={"flex"} justify={"space-between"} style={{marginTop: 20}}>
          <div style={infoColumnStyle}><Icon type="mail"/> {employee.email}</div>
          <div style={infoColumnStyle}><Icon type="phone"/> {employee.phone}</div>
        </Row>
        <Row type={"flex"} justify={"space-between"}>
          <div style={infoColumnStyle}><Icon type="solution"/> {employee.position}</div>
          <div style={infoColumnStyle}><Icon type="dollar"/> {employee.salary.toLocaleString()} HUF</div>
        </Row>
      </Card>
    ) : <EmployeeForm employee={employee} onSuccess={() => this.setIsEditing(false, true)} onCancel={() => this.setIsEditing(false)}/>

    return <div>
      {employeeCard}
    </div>
  }
}

export default EmployeeCard;
