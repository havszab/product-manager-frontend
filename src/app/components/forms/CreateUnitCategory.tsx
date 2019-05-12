import * as React from "react";
import {Form, Button, Row, message} from 'antd'
import {WrappedFormUtils} from "antd/lib/form/Form";
import addFormItem from "../../libs/forms/addFormItem";
import {post} from "../../libs/utils/request";
import {user} from "../../libs/utils/user";
import i18n from "../../libs/i18n";


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
    this.props.form.validateFields(async (err, values: {email: string, name: string}) => {
      if (!values.name) {
        message.warning("Add type first!")
        return
      }
      values.email = user().email
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
      <div style={{width: '100%'}}>
          {addFormItem({
            key: 'name',
            required: true,
            getFieldDecorator,
            label: i18n('acquisition.product.unitName'),
            errorMessage: 'This field is required'
          })}
        </div>
        <Row type="flex" justify="space-around" >
        <Button type={"primary"} htmlType={"submit"} style={{width: '100%'}}>{i18n('acquisition.product.buttons.addUnitCategory')}</Button>
        </Row>
      </div>
    </Form>
  }
}

export default Form.create()(CreateUnitCategory);
