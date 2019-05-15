import React from "react"
import {WrappedFormUtils} from 'antd/lib/form/Form'
import {Button, Card, Form, Icon, Input, message, Row} from 'antd'
import i18n from '../../libs/i18n'
import {user} from '../../libs/utils/user'
import {post} from '../../libs/utils/request'

type props = {
  form: WrappedFormUtils
  seller: boolean
  closeModal: () => void

}
type state = {}

class BusinessPartnerForm extends React.Component<props, state> {
  state = {}

  onSubmitHandler = (e: any): void => {
      e.preventDefault()
      this.props.form.validateFields(async (err, values) => {
        console.log(values)
        values.email = user().email
        values.isClient = !this.props.seller
        if (!this.props.seller) values.templateName = values.companyName
        await post('save-template', values)
          .then((response: {success: boolean}) => {
            if (response.success) {
              message.success(i18n('invoice.templateSuccess'))
              this.props.closeModal()
            }
            else message.error(i18n('statusMessage.operationFailed'))
          })
      })
  }

  render() {
    const {getFieldDecorator} = this.props.form

    const templateNameForm = this.props.seller ? (
      <Row type={"flex"}>
        <Form.Item label={i18n('invoice.form.templateName')} style={{width: '100%'}}>
          {getFieldDecorator('templateName', {
            rules: [{required: true, message: i18n('form.required')}],
          })(
            <Input type={"text"} placeholder={i18n('invoice.form.templateName')}/>
          )}
        </Form.Item>
      </Row>
    ) : null

    return (
      <div>
        <Card>
          <Form onSubmit={this.onSubmitHandler}>
            <Row>
              <div>{this.props.seller ? i18n('invoice.seller') : i18n('invoice.buyer')}</div>
            </Row>
            {templateNameForm}
            <Row type={"flex"}>
              <Form.Item label={i18n('invoice.form.companyName')} style={{width: '100%'}}>
                {getFieldDecorator('companyName', {
                  rules: [{required: true, message: i18n('form.required')}],
                })(
                  <Input type={"text"} placeholder={i18n('invoice.form.companyName')}/>
                )}
              </Form.Item>
            </Row>
            <Row type={"flex"} justify={"space-between"}>

              <Form.Item label={i18n('invoice.form.zip')} style={{width: '20%'}}>
                {getFieldDecorator('zipCode', {
                  rules: [{required: true, message: i18n('form.required')}],
                })(
                  <Input type={"number"} placeholder={i18n('invoice.form.zip')}/>
                )}
              </Form.Item>

              <Form.Item label={i18n('invoice.form.city')} style={{width: '75%'}}>
                {getFieldDecorator('city', {
                  rules: [{required: true, message: i18n('form.required')}],
                })(
                  <Input type={"text"} placeholder={i18n('invoice.form.city')}/>
                )}
              </Form.Item>

            </Row>
            <Row type={"flex"} justify={"space-between"}>

              <Form.Item label={i18n('invoice.form.street')} style={{width: '35%'}}>
                {getFieldDecorator('street', {
                  rules: [{required: true, message: i18n('form.required')}],
                })(
                  <Input type={"text"}
                         placeholder={i18n('invoice.form.street')}/>
                )}
              </Form.Item>

              <Form.Item label={i18n('invoice.form.type')} style={{width: '35%'}}>
                {getFieldDecorator('locationType', {
                  rules: [{required: true, message: i18n('form.required')}],
                })(
                  <Input type={"text"} placeholder={i18n('invoice.form.type')}/>
                )}
              </Form.Item>

              <Form.Item label={i18n('invoice.form.number')} style={{width: '20%'}}>
                {getFieldDecorator('houseNumber', {
                  rules: [{required: true, message: i18n('form.required')}],
                })(
                  <Input type={"text"} placeholder={i18n('invoice.form.number')}/>
                )}
              </Form.Item>

            </Row>
            <Row type={"flex"} justify={"space-between"}>

              <Form.Item label={i18n('invoice.bankNum')} style={{width: '55%'}}>
                {getFieldDecorator('bankNumber', {
                  rules: [{required: this.props.seller, message: i18n('form.required')}],
                })(
                  <Input type={"text"} placeholder={i18n('invoice.bankNum')}/>
                )}
              </Form.Item>

              <Form.Item label={i18n('invoice.form.taxNumber')} style={{width: '40%'}}>
                {getFieldDecorator('taxNumber', {
                  rules: [{required: this.props.seller, message: i18n('form.required')}],
                })(
                  <Input type={"text"} placeholder={i18n('invoice.form.taxNumber')}/>
                )}
              </Form.Item>

            </Row>
            <Row>

              <Button type={'danger'} onClick={this.props.closeModal}>Cancel</Button>
              <Button type={'primary'} htmlType={'submit'}>Save</Button>

            </Row>

          </Form>
        </Card>
      </div>
    )
  }

}

export default Form.create()(BusinessPartnerForm)
