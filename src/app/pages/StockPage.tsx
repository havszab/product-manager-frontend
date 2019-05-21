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
  invoiceItems: Array<Product>
  paymentMethods: Array<string>
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
  owner?: { email: string, password: string, id: number }
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
      clientTemplates: Array<Template>(),
      invoiceItems: Array<Product>(),
      paymentMethods: Array<string>()
    }
  }

  componentDidMount(): void {
    this.fetchAll()
  }

  fetchAll = async () => {
    await this.fetchStock()
    await this.fetchSellerTemplates()
    await this.fetchClientTemplates()
    await this.fetchPaymentMethods()
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

  fetchPaymentMethods = async () => {
    await get('get-payment-methods')
      .then((response: {success: boolean, paymentMethods: Array<string>}) => {
        if (response.success) this.setState({paymentMethods: response.paymentMethods})
          else message.error(i18n('statusMessage.noData'))
      })
  }

  handleSell = (prod: Product) => {
    this.setState({
      prodToSell: prod,
      isModalVisible: true
    })
  }

  onSellFormSubmitHandler = (fetchStock: boolean) => {
    if (fetchStock) this.fetchStock()
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

  partnerModalCancelHandler = (reFetch?: boolean) => {
    this.setState({
      isRegistration: false
    })
    if (reFetch) this.fetchAll()
  }

  handleCascaderChange = (value: string[], selectedOptions: CascaderOptionType[]) => {
    const template: Template = JSON.parse(JSON.stringify(selectedOptions[0].value))
    if (!template.client) this.setState({selectedSellerTemplate: template})
    else this.setState({selectedClientTemplate: template})
  }

  onItemPushHandler = async (item: Product) => {
    let prState = {...this.state}
    let needToPush: boolean = true
    if (prState.invoiceItems.length === 0) {
      prState.invoiceItems.push(item)
      needToPush = false
    } else {
      for (let invItem of prState.invoiceItems) {
        if (invItem.id === item.id && invItem.taxKey === item.taxKey) {
          invItem.quantity += item.quantity
          invItem.itemPrice += item.itemPrice
          invItem.taxAmount += item.taxAmount
          invItem.totalAmount += item.totalAmount
          item.unitPrice = invItem.itemPrice / invItem.quantity
          needToPush = false
          break
        }
      }
    }
    if (needToPush) prState.invoiceItems.push(item)
    for (let stockItem of this.state.stock.products) {
      if (stockItem.id === item.id) {
        stockItem.quantity -= item.quantity
        stockItem.itemPrice = stockItem.unitPrice * stockItem.quantity
      }
    }
    await this.setState({...prState})
  }

  invoiceCreatedHandler = () => {
    this.setState({
      isInvoiceVisible: false,
      selectedClientTemplate: null,
      selectedSellerTemplate: null,
      invoiceItems: Array<Product>()
    })
    this.fetchAll()
  }

  render() {

    const modalOnSell = this.state.prodToSell ? (
      <Modal visible={this.state.isModalVisible}
             footer={null}
             centered={true}
             onCancel={this.modalCancelHandler}
             closable={false}>
        <ItemSell product={this.state.prodToSell}
                  isInvoice={this.state.isInvoiceVisible}
                  onCancel={this.modalCancelHandler}
                  onSubmit={() => this.onSellFormSubmitHandler(!this.state.isInvoiceVisible)}
                  onPush={this.onItemPushHandler}/>
      </Modal>) : null

    const partnerModal = (
      <Modal visible={this.state.isRegistration}
             footer={null}
             centered={true}
             onCancel={() => this.partnerModalCancelHandler()}
             closable={true}>
        <BusinessPartnerForm seller={this.state.isSellerCreate}
                             closeModal={() => this.partnerModalCancelHandler(true)}/>
      </Modal>
    )

    const cascaderCSS = {width: 210}

    const invoiceSwitcherBtn = this.state.isInvoiceVisible ?
      <Row>
        <Col span={12}>
          <Row type={'flex'} justify={'space-around'}>

            <UtilButton tooltip={i18n('operations.cancel')} onClick={() => this.setIsInvoiceVisible(false)}><Icon
              type="close-circle"/></UtilButton>

            <Cascader style={cascaderCSS}
                      options={convertToCascaderType(this.state.sellerTemplates, false, 'templateName')}
                      placeholder={i18n('invoice.blockChoose')}
                      onChange={this.handleCascaderChange}/>

            <UtilButton tooltip={i18n('invoice.newBlock')} onClick={() => {
              this.partnerCreateHandler(true)
            }}/>

            <Cascader style={cascaderCSS}
                      options={convertToCascaderType( this.state.clientTemplates, false,'templateName')}
                      placeholder={i18n('invoice.buyerChoose')}
                      onChange={this.handleCascaderChange}/>

            <UtilButton tooltip={i18n('invoice.newBuyer')} onClick={() => {
              this.partnerCreateHandler(false)
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
                   seller={this.state.selectedSellerTemplate}
                   buyer={this.state.selectedClientTemplate}
                   items={this.state.invoiceItems}
                   paymentMethods={this.state.paymentMethods}
                   onSuccess={this.invoiceCreatedHandler}
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
