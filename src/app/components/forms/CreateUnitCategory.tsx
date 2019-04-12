import * as React from "react";
import {Form, Button, Row, message} from 'antd'
import {WrappedFormUtils} from "antd/lib/form/Form";
import addFormItem from "../../libs/forms/addFormItem";
import {post} from "../../libs/utils/request";


interface CreateUnitCategoryProps extends React.Props<any> {
  form: WrappedFormUtils
  onSuccess?: () => void
}

class CreateUnitCategory extends React.Component<CreateUnitCategoryProps, {}> {
  constructor(props: CreateUnitCategoryProps) {
    super(props)

    this.state = {}
  }

  handleSubmit = (e: any): void => {
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      console.log(values)
      await post('add-unit-category', values)
        .then(response => {
          message.success(response)
          this.props.onSuccess()
          this.props.form.resetFields()
        }).catch(e => {
          message.error(e)
        })
    })
  }


  render(): React.ReactNode {
    const {getFieldDecorator} = this.props.form

    const rowStyle = {margin: 10, border: '#ccc solid 1px', borderRadius: 7, padding: 10}

    return <Form onSubmit={this.handleSubmit}>
      <div style={rowStyle}>
      <div style={{width: 200}}>
          {addFormItem({
            key: 'name',
            required: true,
            getFieldDecorator,
            label: 'Unit category name',
            errorMessage: 'This field is required'
          })}
        </div>
        <Row type="flex" justify="space-around" >
        <Button type={"primary"} htmlType={"submit"}>Add category</Button>
        </Row>
      </div>
    </Form>
  }
}

export default Form.create()(CreateUnitCategory);
