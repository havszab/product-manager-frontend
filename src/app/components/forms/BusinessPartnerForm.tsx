import React from "react"
import {WrappedFormUtils} from 'antd/lib/form/Form'
import {Card, Form, Icon, Input, Row} from 'antd'
import i18n from '../../libs/i18n'

type props = {
  form: WrappedFormUtils
  seller: boolean

}
type state = {}

class BusinessPartnerForm extends React.Component<props, state> {
  state = {}

  render() {
    const {getFieldDecorator} = this.props.form

    return (
      <div>
        <Card>
          <Form>
            <Row>
              <div>{this.props.seller ? i18n('invoice.seller') : i18n('invoice.buyer')}</div>
            </Row>

            <Row type={"flex"}>
              <Form.Item label={i18n('invoice.form.companyName')}>
                {getFieldDecorator('name', {
                  rules: [{required: true, message: i18n('form.required')}],
                })(
                  <Input type={"text"} style={{width: '150px'}}
                         placeholder={i18n('invoice.form.companyName')}
                  />
                )}
              </Form.Item>
            </Row>
            <Row type={"flex"} justify={"space-between"}>

              <Form.Item label={i18n('invoice.form.zip')}>
                {getFieldDecorator('zip', {
                  rules: [{required: true, message: i18n('form.required')}],
                })(
                  <Input type={"text"} //style={{width: '150px'}}
                         placeholder={i18n('invoice.form.zip')}/>
                )}
              </Form.Item>

              <Form.Item label={i18n('invoice.form.city')}>
                {getFieldDecorator('city', {
                  rules: [{required: true, message: i18n('form.required')}],
                })(
                  <Input type={"text"} //style={{width: '150px'}}
                         placeholder={i18n('invoice.form.city')}/>
                )}
              </Form.Item>

            </Row>
            <Row type={"flex"} justify={"space-between"}>

              <Form.Item label={i18n('invoice.form.street')}>
                {getFieldDecorator('street', {
                  rules: [{required: true, message: i18n('form.required')}],
                })(
                  <Input type={"text"} //style={{width: '150px'}}
                         placeholder={i18n('invoice.form.street')}/>
                )}
              </Form.Item>

              <Form.Item label={i18n('invoice.form.type')}>
                {getFieldDecorator('type', {
                  rules: [{required: true, message: i18n('form.required')}],
                })(
                  <Input type={"text"} //style={{width: '150px'}}
                         placeholder={i18n('invoice.form.type')}/>
                )}
              </Form.Item>

              <Form.Item label={i18n('invoice.form.number')}>
                {getFieldDecorator('number', {
                  rules: [{required: true, message: i18n('form.required')}],
                })(
                  <Input type={"text"} //style={{width: '150px'}}
                         placeholder={i18n('invoice.form.number')}/>
                )}
              </Form.Item>

            </Row>
            <Row type={"flex"} justify={"space-between"}>

              <Form.Item label={i18n('invoice.bankNum')}>
                {getFieldDecorator('bankNum', {
                  rules: [{required: true, message: i18n('form.required')}],
                })(
                  <Input type={"text"} //style={{width: '150px'}}
                         placeholder={i18n('invoice.bankNum')}/>
                )}
              </Form.Item>

            </Row>
            <Row type={"flex"} justify={"space-between"}>

              <Form.Item label={i18n('invoice.form.taxNumber')}>
                {getFieldDecorator('taxNumber', {
                  rules: [{required: true, message: i18n('form.required')}],
                })(
                  <Input type={"text"} //style={{width: '150px'}}
                         placeholder={i18n('invoice.form.taxNumber')}/>
                )}
              </Form.Item>

            </Row>
          </Form>
        </Card>
      </div>
    )
  }

}

export default Form.create()(BusinessPartnerForm)
