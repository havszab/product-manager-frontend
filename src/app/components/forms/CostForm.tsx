import React from "react";
import Form, {WrappedFormUtils} from "antd/lib/form/Form";
import {Card, Input, Icon, message} from "antd";
import Row from "antd/lib/grid/row";
import {get, post} from "../../libs/utils/request";
import Cascader from "antd/es/cascader";
import {CascaderOptionType} from "antd/lib/cascader";
import {user} from "../../libs/utils/user";

type props = {
  form: WrappedFormUtils
  onSuccess: () => void
  onCancel: () => void
}
type state = {
  types: Array<string>
  selectedType: string
}

interface FormData {
  id: number
  name: string
  cost: number
  payedLastDate: Date
  type: string
  email: string
}

class CostForm extends React.Component<props, state> {
  state = {
    types: Array<string>(),
    selectedType: 'ANNUAL'
  }


  componentDidMount(): void {
    this.fetchCostTypes()
  }

  fetchCostTypes = async () => {
    await get('get-cost-types')
      .then((response: {types: Array<string>}) => {
        this.setState({
          types: response.types
        })
      })
  }

  getCascaderOptins = (): Array<CascaderOptionType> => {
    let options = Array<CascaderOptionType>()
    for (let type of this.state.types) {
      let option: CascaderOptionType = {
        value: type,
        label: type
      }
      options.push(option)
    }
    return options
  }

  handleCascaderChange = (value: string[], selectedOptions: Array<CascaderOptionType>) => {
    console.log(value)
    console.log(selectedOptions)
    const type: string = value[0]
    this.setState({
      selectedType: type
    })
  }

  handleSubmit = (e: any): void => {
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      const requestBody: FormData = values
      requestBody.email = user().email
      requestBody.type = this.state.selectedType
      console.log(requestBody)
      await post('add-cost', requestBody)
        .then(response => {
          message.success(response)
          this.props.onSuccess()
        })
    })
  }

  render() {
    const {getFieldDecorator} = this.props.form

    const options = this.getCascaderOptins()

    const cellStyle = {margin: 5, padding: 5, width: '100%', border: '1px solid #f5222d', borderRadius: 5, backgroundColor: "#E7E9ED"}

    return (
      <div style={{maxWidth: 220}}>
        <Form onSubmit={this.handleSubmit}>
          <Card actions={[<div><button type={"submit"} style={{border: 'none'}}><Icon type="save"/></button></div>, <div onClick={this.props.onCancel}><Icon type="rollback"/></div>]} style={{
            border: '1px solid #f5222d',
            minWidth: 180,
            minHeight: 220,
            margin: 5,
            backgroundColor: "rgb(255, 206, 86, 0.5)"
          }}>
            <Row type={"flex"} justify={"space-around"}>
              <Form.Item>
                {getFieldDecorator('name', {
                  rules: [{required: true, message: 'Cost title required'}],
                })(
                  <Input type={"text"}
                         placeholder={'Cost title'}
                         style={{width: '100%', borderBottom: '1px solid #f5222d', fontWeight: 'bold'}}/>
                )}
              </Form.Item>
            </Row>
            <Row>
              <div style={cellStyle}><Icon type="retweet"/> Frequency
                <Cascader options={options} onChange={this.handleCascaderChange}/>
              </div>
            </Row>
            <Row>
              <Form.Item>
                {getFieldDecorator('cost', {
                  rules: [{required: true, message: 'Amount required'}],
                })(
                  <Input type={'number'} style={cellStyle}
                         prefix={<Icon type="dollar" />}
                         placeholder={'Amount'}/>
                )}
              </Form.Item>
            </Row>
            <div style={cellStyle}>
              <Row>
                <div></div>
              </Row>
              <Row>
                <div><Icon type="calendar"/></div>
              </Row>
            </div>
          </Card>
        </Form>
      </div>)
  }
}

export default Form.create()(CostForm);
