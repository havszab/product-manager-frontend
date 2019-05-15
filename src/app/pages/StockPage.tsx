import * as React from "react"
import ProductTable from "../components/tables/ProductTable"
import {get, post} from "../libs/utils/request"
import {user} from "../libs/utils/user"
import {Card, Cascader, Col, Icon, message, Modal, Row} from 'antd'
import ItemSell from "../components/forms/ItemSellForm"
import PageTitle from "../components/utils/PageTitle"
import i18n from '../libs/i18n'
import UtilButton from '../components/utils/UtilButton'
import Invoice from '../components/Invoice'
import BusinessPartnerForm from '../components/forms/BusinessPartnerForm'
import {CascaderOptionType} from 'antd/es/cascader'
import {convertToCascaderType} from '../libs/utils/dataConverter'

interface StockPageProps extends React.Props <any> {
}

type state = {
  stock: Stock
  isModalVisible: boolean
  prodToSell?: Product
  isInvoiceVisible: boolean
  isRegistration: boolean
  isSellerCreate: boolean
  sellerTemplates: Array<Template>
  selectedSellerTemplate?: Template
  clientTemplates: Array<Template>
  selectedClientTemplate?: Template
}

interface Stock {
  id: number
  owner: User
  products: Array<Product>
}

interface Response {
  stock?: Stock
}

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

interface Product {
  id: number
  description?: string
  itemPrice: number
  unitPrice: number
  quantity: number
  status: string
  productCategory: ProductCategory,
  unitCategory: UnitCategory
}

interface ProductCategory {
  id: number
  productName: string
}

interface UnitCategory {
  id: number
  unitName: string
}


interface User {
  email: string
  password: string
}

class StockPage extends React.Component<StockPageProps, state> {
  constructor(props: StockPageProps) {
    super(props)

    this.state = {
      stock: new class implements Stock {
        id: number
        owner: User
        products: Array<Product>
      },
      isModalVisible: false,
      isInvoiceVisible: false,
      isRegistration: false,
      isSellerCreate: false,
      sellerTemplates: Array<Template>(),
      clientTemplates: Array<Template>()
    }
  }

  componentDidMount(): void {
    this.fetchAll()
  }

  fetchAll = async () => {
    await this.fetchStock()
    await this.fetchSellerTemplates()
    await this.fetchClientTemplates()
  }

  fetchStock = async () => {
    await post('get-stock', user())
      .then((response: Response) => {
        this.setState({
          stock: response.stock
        })
      })
  }

  fetchSellerTemplates = async () => {
    await get('get-seller-templates', {email: user().email})
      .then((response: { success: boolean, templates: Array<Template> }) => {
        if (response.success) this.setState({sellerTemplates: response.templates})
        else message.error(i18n('statusMessage.operationFailed'))
      })
  }

  fetchClientTemplates = async () => {
    await get('get-client-templates', {email: user().email})
      .then((response: { success: boolean, templates: Array<Template> }) => {
        if (response.success) this.setState({clientTemplates: response.templates})
        else message.error(i18n('statusMessage.operationFailed'))
      })
  }

  handleSell = (prod: Product) => {
    this.setState({
      prodToSell: prod,
      isModalVisible: true
    })
  }

  onSellFormSubmitHandler = () => {
    this.fetchStock()
    this.setState({
      isModalVisible: false,
      prodToSell: null
    })
  }

  modalCancelHandler = () => {
    this.setState({
      isModalVisible: false,
      prodToSell: null
    })
  }

  setIsInvoiceVisible = (isVisible: boolean) => {
    this.setState({
      isInvoiceVisible: isVisible
    })
  }

  partnerCreateHandler = (isSeller: boolean) => {
    this.setState({
      isRegistration: true,
      isSellerCreate: isSeller
    })
  }

  partnerModalCancelHandler = () => {
    this.setState({
      isRegistration: false
    })
  }

  render() {

    const modalOnSell = this.state.prodToSell ? (
      <Modal visible={this.state.isModalVisible}
             footer={null}
             centered={true}
             onCancel={this.modalCancelHandler}
             closable={false}>
        <ItemSell product={this.state.prodToSell}
                  onCancel={this.modalCancelHandler}
                  onSubmit={this.onSellFormSubmitHandler}/>
      </Modal>) : null

    const partnerModal = (
      <Modal visible={this.state.isRegistration}
             footer={null}
             centered={true}
             onCancel={this.partnerModalCancelHandler}
             closable={true}>
        <BusinessPartnerForm seller={this.state.isSellerCreate} closeModal={this.partnerModalCancelHandler}/>
      </Modal>
    )

    const cascaderCSS = {width: 210}

    const invoiceSwitcherBtn = this.state.isInvoiceVisible ?
      <Row>
        <Col span={12}>
          <Row type={'flex'} justify={'space-around'}>

            <UtilButton tooltip={i18n('invoice.new')} onClick={() => this.setIsInvoiceVisible(false)}><Icon
              type="close-circle"/></UtilButton>

            <Cascader style={cascaderCSS} options={convertToCascaderType('templateName', this.state.sellerTemplates)} placeholder={i18n('invoice.blockChoose')}/>

            <UtilButton tooltip={i18n('invoice.newBlock')} onClick={() => {
            }}/>

            <Cascader style={cascaderCSS} options={convertToCascaderType('templateName', this.state.clientTemplates)} placeholder={i18n('invoice.buyerChoose')}/>

            <UtilButton tooltip={i18n('invoice.newBuyer')} onClick={() => {
            }}/>
          </Row>
        </Col>
      </Row>
      :
      <UtilButton tooltip={i18n('invoice.new')} onClick={() => this.setIsInvoiceVisible(true)}>
        <Icon type="file-sync"/></UtilButton>


    const stockContent = this.state.isInvoiceVisible ?
      <Row gutter={8}>
        <Col span={12}>
          <Invoice onPartnerCreate={this.partnerCreateHandler}
                   seller={null}
                   buyer={null}
          />
        </Col>
        <Col span={12}>
          <Card style={{marginTop: 10}}>
            <Row type={'flex'} justify={'space-around'}>
              <h3>{i18n('stock.title')}</h3>
            </Row>
            <ProductTable data={this.state.stock.products}
                          stockOperations={true}
                          onSuccess={this.fetchStock}
                          onSell={this.handleSell}
                          size={'small'}
            />
          </Card>
        </Col>
      </Row> :
      <Row gutter={8}>
        <Col span={24}>
          <ProductTable data={this.state.stock.products}
                        stockOperations={true}
                        onSuccess={this.fetchStock}
                        onSell={this.handleSell}
          />
        </Col>
      </Row>

    return <div>
      <PageTitle title={i18n('stock.title')}/>
      {invoiceSwitcherBtn}
      {stockContent}
      {modalOnSell}
      {partnerModal}
    </div>
  }
}

export default StockPage
