import React from "react"
import {Button, Card, Cascader, Col, DatePicker, Empty, Icon, Modal, Row} from 'antd'
import InvoiceItemTable from './tables/InvoiceItemTable'
import InvoiceCard from './cards/InvoiceCard'
import AddButton from '../libs/utils/AddButton'
import i18n from '../libs/i18n'
import ItemSell from '../pages/StockPage'
import BusinessPartnerForm from './forms/BusinessPartnerForm'

type props = {}
type state = {
  isModalVisible: boolean
}

class Invoice extends React.Component<props, state> {
  state = {
    isModalVisible: false
  }

  isModalVisibleSwitchHandler = (isVisible: boolean) => {
    this.setState({
      isModalVisible: isVisible
    })
  }


  modalCancelHandler = () => {
    this.setState({
      isModalVisible: false
    })
  }

  render() {

    const datePickerStyle = {width: '100%', marginTop: 5}

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
            <InvoiceCard/>
          </Col>
          <Col span={12}>
            <InvoiceCard/>
          </Col>
        </Row>

        <div style={{borderBottom: '1px solid #1890ff', borderTop: '1px solid #1890ff', padding: 5, margin: '3px 0px'}}>
          <Row gutter={8}>
            <Col span={12}>
              <Cascader
                options={[{title: 'Átutalás', value: 'Átutalás'}]}
                placeholder={'Válasszon fizetési módot'}
                style={datePickerStyle}
              />
            </Col>
            <Col span={12}>
              <DatePicker
                placeholder={'Számla kelte'}
                style={datePickerStyle}/>
            </Col>
          </Row>

          <Row gutter={8}>
            <Col span={12}>
              <DatePicker
                placeholder={'Teljesítés határideje'}
                style={datePickerStyle}/>
            </Col>
            <Col span={12}>
              <DatePicker
                placeholder={'Teljesítés időpontja'}
                style={datePickerStyle}/>
            </Col>
          </Row>
        </div>

        <Row>
          <InvoiceItemTable/>
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
            <Card><Empty description={i18n('statusMessage.dataMissing')}><Button type={'primary'}>{i18n('invoice.newBlock')}</Button></Empty></Card>
          </Col>
          <Col span={12}>
            <Card><Empty description={i18n('statusMessage.dataMissing')}><Button type={'primary'}>{i18n('invoice.newBuyer')}</Button></Empty></Card>
          </Col>
        </Row>

        <div style={{borderBottom: '1px solid #1890ff', borderTop: '1px solid #1890ff', padding: 5, margin: '3px 0px'}}>
          <Row gutter={8}>
            <Col span={12}>
              <Cascader
                options={[{title: 'Átutalás', value: 'Átutalás'}]}
                placeholder={'Válasszon fizetési módot'}
                style={datePickerStyle}
              />
            </Col>
            <Col span={12}>
              <DatePicker
                placeholder={'Számla kelte'}
                style={datePickerStyle}/>
            </Col>
          </Row>

          <Row gutter={8}>
            <Col span={12}>
              <DatePicker
                placeholder={'Teljesítés határideje'}
                style={datePickerStyle}/>
            </Col>
            <Col span={12}>
              <DatePicker
                placeholder={'Teljesítés időpontja'}
                style={datePickerStyle}/>
            </Col>
          </Row>
        </div>

        <Row>
          <InvoiceItemTable/>
        </Row>

        <Row type={'flex'} justify={'space-around'} style={{margin: 5}}>
          <Button type={'danger'}>Mégse</Button>
          <Button type={'primary'}>Számla kiállítása</Button>
          <AddButton tooltip={i18n('invoice.preview')} onClick={() => this.isModalVisibleSwitchHandler(true)}><Icon
            type="file-search"/></AddButton>
        </Row>
        {preview}
      </div>
    )
  }

}

export default Invoice
