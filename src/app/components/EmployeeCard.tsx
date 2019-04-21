import React from "react";
import {Card, Row, Avatar, Icon} from "antd";

type props = {
  employee: Employee
}
type state = {}

interface Employee {
  email: string
  firstName: string
  lastName: string
  phone: string
  position: string
  salary: number
  ownerEmail: string
}

class EmployeeCard extends React.Component<props, state> {
  state = {}

  render() {

    const {employee} = this.props

    const infoColumnStyle = {width: 180, margin: 10}

    return <div>
      <Card style={{width: 450, marginTop: 16}} actions={[<Icon type="edit"/>, <Icon type="close"/>]}>
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
    </div>
  }
}

export default EmployeeCard;
