import React from "react"
import {Card, Col, Row} from 'antd'

type props = {}
type state = {}

class InvoiceCard extends React.Component<props, state> {
  state = {}

  render() {
    return (
      <div>
        <Card>
          <Row><Col span={6}>Eladó</Col></Row>
          <Row type={'flex'} justify={'space-around'}>
            <Col span={24}>Havszab Solutions Kft.</Col>
          </Row>
          <Row gutter={8} type={'flex'}>
            <Col>2310</Col>
            <Col>Szigetszentmiklós</Col>
          </Row>
          <Row gutter={8} type={'flex'}>
            <Col>Szél utca</Col>
            <Col>12</Col>
          </Row>
          <Row gutter={8}>
            <Col>6857358223</Col>
          </Row>
        </Card>
      </div>
    )
  }

}

export default InvoiceCard
