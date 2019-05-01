import React from "react";
import Form, {WrappedFormUtils} from "antd/lib/form/Form";
import {Card, Input, Avatar, Icon, message, Tooltip} from "antd";
import Row from "antd/lib/grid/row";
import {user} from "../../libs/utils/user";
import {post} from "../../libs/utils/request";

type props = {
  form: WrappedFormUtils
  onSuccess: () => void
  onCancel: () => void
}
type state = {}

interface FormData {
  email: string
  firstName: string
  lastName: string
  phone: string
  position: string
  salary: number
  ownerEmail: string
}

class EmployeeForm extends React.Component<props, state> {
  state = {}

  handleSubmit = (e: any): void => {
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      const requestBody: FormData = values
      requestBody.ownerEmail = user().email
      console.log(requestBody)
      await post('save-employee', requestBody)
        .then(response => {
          message.success(response)
          this.props.onSuccess()
        })
    })
  }

  render() {
    const {getFieldDecorator} = this.props.form

    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <Card style={{width: 450, marginTop: 16}}
                actions={[<button type={"submit"} style={{border: 'none'}}><Tooltip title={'Save employee'}><Icon type="save"/></Tooltip></button>, <Tooltip title={'Cancel creation'}><Icon onClick={this.props.onCancel} type="rollback"/></Tooltip>]}>

            <Row type={"flex"} justify={"space-between"}>
              <Avatar shape={'square'} size={64} icon="user"/>
              <Form.Item>
                {getFieldDecorator('firstName', {
                  rules: [{required: true, message: 'First name required'}],
                })(
                  <Input type={"text"} style={{width: '150px'}}
                         prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                         placeholder={'First name'}/>
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator('lastName', {
                  rules: [{required: true, message: 'Last name required'}],
                })(
                  <Input style={{width: '150px'}} prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                         placeholder={'Last name'}/>
                )}
              </Form.Item>
            </Row>
            <Row type={"flex"} justify={"space-between"} style={{marginTop: 20}}>
              <Form.Item>
                {getFieldDecorator('email', {
                  rules: [{required: true, message: 'Email required'}],
                })(
                  <Input style={{width: '180px'}} prefix={<Icon type="mail" style={{color: 'rgba(0,0,0,.25)'}}/>}
                         placeholder={'Email'}/>
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator('phone', {
                  rules: [{required: true, message: 'Email required'}],
                })(
                  <Input style={{width: '180px'}} prefix={<Icon type="phone" style={{color: 'rgba(0,0,0,.25)'}}/>}
                         placeholder={'Phone '}/>
                )}
              </Form.Item>
            </Row>
            <Row type={"flex"} justify={"space-between"}>
              <Form.Item>
                {getFieldDecorator('position', {
                  rules: [{required: true, message: 'Position required'}],
                })(
                  <Input style={{width: '180px'}} prefix={<Icon type="solution" style={{color: 'rgba(0,0,0,.25)'}}/>}
                         placeholder={'Position'}/>
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator('salary', {
                  rules: [{required: true, message: 'Salary required'}],
                })(
                  <Input type={'number'} style={{width: '180px'}}
                         prefix={<Icon type="dollar" style={{color: 'rgba(0,0,0,.25)'}}/>}
                         placeholder={'Salary '}/>
                )}
              </Form.Item>
            </Row>
          </Card>
        </Form>
      </div>)
  }
}

export default Form.create()(EmployeeForm);
