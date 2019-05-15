import React from "react"
import {Card, Col, Row} from 'antd'
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
  isClient: boolean
  locationType: string
  street: string
  taxNumber?: string
  templateName: string
  zipCode: number
}

class BusinessPartnerCard extends React.Component<props, state> {
  state = {}

  render() {
    const {template} = this.props

    return (
      <div>
        <Card>
          <Row><Col span={6}>{template.isClient ? i18n('invoice.seller') : i18n('invoice.buyer') }</Col></Row>
          <Row type={'flex'} justify={'space-around'}>
            <Col span={24}>{template.companyName}</Col>
          </Row>
          <Row gutter={8} type={'flex'}>
            <Col>{template.zipCode}</Col>
            <Col>{template.city}</Col>
          </Row>
          <Row gutter={8} type={'flex'}>
            <Col>{template.street}</Col>
            <Col>{template.locationType}</Col>
            <Col>{template.houseNumber}.</Col>
          </Row>
          <Row gutter={8}>
            <Col>{template.bankNumber? template.bankNumber : null}</Col>
          </Row>
          <Row gutter={8}>
            <Col>{template.taxNumber? template.taxNumber : null}</Col>
          </Row>
        </Card>
      </div>
    )
  }

}

export default BusinessPartnerCard
