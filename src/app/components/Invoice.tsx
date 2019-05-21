import React from "react"
import {Button, Card, Cascader, Col, DatePicker, Empty, Form, Icon, Input, message, Modal, Row} from 'antd'
import InvoiceItemTable from './tables/InvoiceItemTable'
import BusinessPartnerCard from './cards/BusinessPartnerCard'
import UtilButton from './utils/UtilButton'
import i18n from '../libs/i18n'
import {convertToCascaderType} from '../libs/utils/dataConverter'
import {WrappedFormUtils} from 'antd/lib/form/Form'
import {Moment} from 'moment'
import {user} from '../libs/utils/user'
import {post} from '../libs/utils/request'

type props = {
  form: WrappedFormUtils
  onPartnerCreate: (isSeller: boolean) => void
  seller: Template
  buyer: Template
  items: Array<Product>
  paymentMethods: Array<string>
  onSuccess: () => void
}
type state = {
  isModalVisible: boolean
  invoiceDate: Date
  paymentDeadline: Date
  paymentDate: Date
  paymentMethod: string
}

interface FormValues {
  paymentMethod: Array<string>
  invoiceDate: Moment
  paymentDeadline: Moment
  paymentDate: Moment
}

interface Template {
  id: number
  bankNumber?: string
  city: string
  companyName: string
  houseNumber: string
  client: boolean
  locationType: string
  street: string
  taxNumber?: string
  templateName: string
  zipCode: number
  owner?: any
}

interface Product {
  id: number
  description?: string
  itemPrice: number
  unitPrice: number
  quantity: number
  status: string
  productCategory: ProductCategory
  unitCategory: UnitCategory
  taxKey?: number
  taxAmount?: number
  totalAmount?: number
  sellingPrice: number
}

interface ProductCategory {
  id: number
  productName: string
}

interface UnitCategory {
  id: number
  unitName: string
}

class Invoice extends React.Component<props, state> {
  state = {
    isModalVisible: false,
    invoiceDate: new Date(),
    paymentDeadline: new Date(),
    paymentDate: new Date(),
    paymentMethod: '-'
  }

  isModalVisibleSwitchHandler = (isVisible: boolean) => {
    this.setState({
      isModalVisible: isVisible
    })
    this.props.form.validateFields(async (err, values: FormValues) => {
      console.log(values)
      this.setState({
        paymentDate: values.paymentDate !== undefined ? values.paymentDate.toDate() : null,
        paymentDeadline: values.paymentDeadline !== undefined ? values.paymentDeadline.toDate() : null,
        invoiceDate: values.invoiceDate !== undefined ? values.invoiceDate.toDate() : null,
        paymentMethod: values.paymentMethod[0] !== undefined ? values.paymentMethod[0] : 'not sel'
      })
    })
  }


  modalCancelHandler = () => {
    this.setState({
      isModalVisible: false
    })
  }


  handleSubmit = (e: any) => {
    e.preventDefault()
    this.props.form.validateFields(async (err, values: FormValues) => {
      if (!err) {
        let requestBody = {
          sellerId: this.props.seller.id,
          buyerId: this.props.buyer.id,
          paymentMethod: values.paymentMethod[0],
          invoiceDate: values.invoiceDate.toDate().getTime(),
          paymentDeadline: values.paymentDeadline.toDate().getTime(),
          paymentDate: values.paymentDate.toDate().getTime(),
          items: this.props.items,
          email: user().email
        }
        //console.log(requestBody)
        await post('create-invoice', requestBody)
          .then((response: { success: boolean }) => {
            if (response.success) message.success('Success!')
          })
          .then(
            () => this.props.onSuccess()
          )
      } else console.log(err)
    })
  }

  render() {

    const {getFieldDecorator} = this.props.form

    const datePickerStyle = {width: '100%', marginTop: 0}

    const previewDateStyle = {width: '100%', marginTop: 5, padding: 5, border: '1px solid #1890ff', borderRadius: 4}

    const seller = this.props.seller ?
      <BusinessPartnerCard template={this.props.seller}/> :
      <Card>
        <Empty description={i18n('statusMessage.dataMissing')}>
          <Button type={'primary'} onClick={() => this.props.onPartnerCreate(true)}>
            {i18n('invoice.newBlock')}
          </Button>
        </Empty>
      </Card>

    const buyer = this.props.buyer ?
      <BusinessPartnerCard template={this.props.buyer}/> :
      <Card>
        <Empty description={i18n('statusMessage.dataMissing')}>
          <Button type={'primary'} onClick={() => this.props.onPartnerCreate(false)}>
            {i18n('invoice.newBuyer')}
          </Button>
        </Empty>
      </Card>

    const preview = (<Modal visible={this.state.isModalVisible}
                            footer={null}
                            centered={true}
                            onCancel={this.modalCancelHandler}
                            closable={true}
                            style={{minWidth: '80%'}}>
      <div style={{marginTop: 15, padding: 5, border: '1px solid #1890ff', borderRadius: 4, width: '100%'}}>
        <Row type={'flex'} justify={'space-between'} style={{borderBottom: '1px solid #1890ff', marginBottom: 5}}>
          <Col span={8}>
            <div style={{fontSize: '2em', margin: 5, textIndent: 10}}>{i18n('invoice.invoice')}</div>
          </Col>
          <Col offset={8}>
            <div>{i18n('invoice.no')} : 00001</div>
          </Col>
        </Row>

        <Row gutter={8}>
          <Col span={12}>
            {seller}
          </Col>
          <Col span={12}>
            {buyer}
          </Col>
        </Row>

        <div style={{borderBottom: '1px solid #1890ff', borderTop: '1px solid #1890ff', padding: 5, margin: '3px 0px'}}>
          <Row gutter={8}>
            <Col span={12}>
              <div
                style={previewDateStyle}>{i18n('invoice.paymentMethod') + ': ' + (this.state.paymentMethod ? this.state.paymentMethod : '')}</div>
            </Col>
            <Col span={12}>
              <div
                style={previewDateStyle}>{i18n('invoice.form.invoiceDate') + ': ' + (this.state.invoiceDate ? this.state.invoiceDate.toLocaleDateString() : '')}</div>
            </Col>
          </Row>

          <Row gutter={8}>
            <Col span={12}>
              <div
                style={previewDateStyle}>{i18n('invoice.form.paymentDeadline') + ': ' + (this.state.paymentDeadline ? this.state.paymentDeadline.toLocaleDateString() : '')}</div>
            </Col>
            <Col span={12}>
              <div
                style={previewDateStyle}>{i18n('invoice.form.paymentDate') + ': ' + (this.state.paymentDate ? this.state.paymentDate.toLocaleDateString() : '')}</div>
            </Col>
          </Row>
        </div>

        <Row>
          <InvoiceItemTable items={this.props.items} size={'middle'}/>
        </Row>
      </div>
    </Modal>)

    return (
      <div style={{marginTop: 10, padding: 5, border: '1px solid #1890ff', borderRadius: 4}}>
        <Row type={'flex'} justify={'space-between'} style={{borderBottom: '1px solid #1890ff', marginBottom: 5}}>
          <Col span={8}>
            <div style={{fontSize: '2em', margin: 5, textIndent: 10}}>{i18n('invoice.invoice')}</div>
          </Col>
          <Col offset={8}>
            <div>{i18n('invoice.no')} : 00001</div>
          </Col>
        </Row>

        <Row gutter={8}>
          <Col span={12}>
            {seller}
          </Col>
          <Col span={12}>
            {buyer}
          </Col>
        </Row>

        <Form onSubmit={this.handleSubmit}>
          <div
            style={{borderBottom: '1px solid #1890ff', borderTop: '1px solid #1890ff', padding: 5, margin: '3px 0px'}}>
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item>
                  {getFieldDecorator('paymentMethod', {
                    rules: [{required: true, message: i18n('form.required')}],
                  })(
                    <Cascader
                      options={convertToCascaderType(this.props.paymentMethods, true)}
                      placeholder={i18n('invoice.form.choosePayment')}
                      style={datePickerStyle}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item>
                  {getFieldDecorator('invoiceDate', {
                    rules: [{required: true, message: i18n('form.required')}],
                  })(
                    <DatePicker
                      placeholder={i18n('invoice.form.invoiceDate')}
                      style={datePickerStyle}/>
                  )}
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={8}>
              <Col span={12}>
                <Form.Item>
                  {getFieldDecorator('paymentDeadline', {
                    rules: [{required: true, message: i18n('form.required')}],
                  })(
                    <DatePicker
                      placeholder={i18n('invoice.form.paymentDeadline')}
                      style={datePickerStyle}/>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item>
                  {getFieldDecorator('paymentDate', {
                    rules: [{required: true, message: i18n('form.required')}],
                  })(
                    <DatePicker
                      placeholder={i18n('invoice.form.paymentDate')}
                      style={datePickerStyle}/>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </div>

          <Row>
            <InvoiceItemTable items={this.props.items} size={'small'}/>
          </Row>

          <Row type={'flex'} justify={'space-around'} style={{margin: 5}}>
            <Button type={'danger'} style={{width: '30%'}}>{i18n('operations.cancel')}</Button>
            <Button htmlType={'submit'} type={'primary'} style={{width: '30%'}}>{i18n('invoice.new')}</Button>
            <UtilButton tooltip={i18n('invoice.newItem')} onClick={() => {
            }}/>
            <UtilButton tooltip={i18n('invoice.preview')} onClick={() => this.isModalVisibleSwitchHandler(true)}><Icon
              type="file-search"/></UtilButton>
          </Row>
        </Form>
        {preview}
      </div>
    )
  }

}

export default Form.create()(Invoice)
