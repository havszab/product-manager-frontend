import React from "react"
import {Card, Col, Icon, Row} from 'antd'
import i18n from '../../libs/i18n'

type props = {
  template: Template
}
type state = {}

interface Template {
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

class BusinessPartnerCard extends React.Component<props, state> {
  state = {}

  render() {
    const {template} = this.props

    return (
      <div>
        <Card style={{minHeight: 250}}>
          <Row><Col span={6} style={{fontSize: '2em', fontWeight: 'bold', textDecoration: 'underline'}}>{!template.client ? i18n('invoice.seller') : i18n('invoice.buyer') }</Col></Row>
          <Row type={'flex'} justify={'space-around'}>
            <Col span={24} style={{fontSize: '1.2em'}}>{template.companyName}</Col>
          </Row>
          <Row gutter={8} type={'flex'} style={{marginTop: 10}}>
            <Col><Icon type="home" /></Col>
            <Col>{template.zipCode}</Col>
            <Col>{template.city}</Col>

            <Col>{template.street}</Col>
            <Col>{template.locationType}</Col>
            <Col>{template.houseNumber}.</Col>
          </Row>
          <Row gutter={8} type={'flex'} style={{marginTop: 10}}>
            <Col>{template.bankNumber? <div><Icon type="bank" />{i18n('invoice.bankNum') +': '+ template.bankNumber}</div> : null}</Col>
          </Row>
          <Row gutter={8} type={'flex'} style={{marginTop: 10}}>
            <Col>{template.taxNumber? i18n('invoice.form.taxNumber') + ': ' + template.taxNumber : null}</Col>
          </Row>
        </Card>
      </div>
    )
  }

}

export default BusinessPartnerCard
