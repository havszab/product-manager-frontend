import React from "react";
import {Avatar, Button, Card, Form, Icon, Input, Row, Tooltip} from "antd";
import {WrappedFormUtils} from "antd/lib/form/Form";

type props = {
  form: WrappedFormUtils
}
type state = {}

class InvestmentForm extends React.Component<props, state> {
  state = {}

  render() {
    const {getFieldDecorator} = this.props.form

    const keyStyle = {width: 180, margin: 10}
    const valueStyle = {width: '100%', margin: 10, border: '1px solid #ccc', borderRadius: 4, padding: 8}
    const iconPrefixStyle = {paddingRight: 4}
    const buttonStyle = {fontWeight: 'bold' as 'bold', padding: '0px 7px', margin: 3, fontSize: '1.2em'}

    return <div>
      <Card style={{width: 500, minHeight: 550, marginTop: 16}}>
        <Row type={"flex"} justify={"space-between"} style={{borderBottom: '1px solid #ccc'}}>
          <Avatar size={64} shape={'square'} icon="car"/>
            <Form.Item>
              {getFieldDecorator('title', {
                rules: [{required: true, message: 'Please provide title!'}],
              })(
                <Input size={"large"}  style={{width: 250, marginTop: 20, marginBottom: 20, fontSize: '1.4em', fontWeight: 'bold'}}
                       type="text" placeholder={'Title'}/>
              )}
            </Form.Item>
          <div>
            <Tooltip title={'Save investment'}>
              <Button type={"primary"} shape={'round'} style={buttonStyle}><Icon type="save"/></Button>
            </Tooltip>
            <Tooltip title={'Cancel investment creation'}>
              <Button type={"danger"} shape={'round'} style={buttonStyle}><Icon type="close"/></Button>
            </Tooltip>
          </div>
        </Row>
        <Row type={"flex"} justify={"space-between"} style={{marginTop: 20}}>
          <div style={keyStyle}>Value:</div>
          <div style={{width: '100%'}}>
            <Form.Item>
              {getFieldDecorator('value', {
                rules: [{required: true, message: 'Please provide value!'}],
              })(
                <Input style={{width: '100%'}} prefix={<Icon type="dollar"/>}
                       type="number" placeholder={'Acquisition value'}/>
              )}
            </Form.Item>
          </div>
        </Row>
        <Row type={"flex"} justify={"space-between"}>
          <div style={keyStyle}>Description:</div>
        </Row>
        <Row type={"flex"} justify={"space-between"}>
          <div style={{width: '100%'}}>
            <Form.Item>
              {getFieldDecorator('description', {
                rules: [{required: true, message: 'Please add a short description!'}],
              })(
                <Input style={{width: '100%'}} prefix={<Icon type="edit"/>}
                       type="text" placeholder={'Description'}/>
              )}
            </Form.Item>
          </div>
        </Row>

        <Row type={"flex"} justify={"space-between"}>
          <div style={keyStyle}>Date of acquisition:</div>
          <div style={valueStyle}><Icon type="calendar" style={iconPrefixStyle}/>
            {new Date().toLocaleDateString()}
          </div>
        </Row>
      </Card>
    </div>
  }
}

export default Form.create()(InvestmentForm);
