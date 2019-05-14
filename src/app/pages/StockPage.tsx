import * as React from "react"
import ProductTable from "../components/tables/ProductTable"
import {post} from "../libs/utils/request"
import {user} from "../libs/utils/user"
import {Card, Cascader, Col, Icon, Modal, Row} from 'antd'
import ItemSell from "../components/forms/ItemSellForm"
import PageTitle from "../components/utils/PageTitle"
import i18n from '../libs/i18n'
import AddButton from '../libs/utils/AddButton'
import Invoice from '../components/Invoice'

interface StockPageProps extends React.Props <any> {
}

type state = {
  stock: Stock
  isModalVisible: boolean
  prodToSell?: Product
  isInvoiceVisible: boolean
  isRegistration: boolean
}

interface Stock {
  id: number
  owner: User
  products: Array<Product>
}

interface Response {
  stock?: Stock
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
      isRegistration: false
    }
  }

  componentDidMount(): void {
    this.fetchStock()
  }

  fetchStock = async () => {
    await post('get-stock', user())
      .then((response: Response) => {
        this.setState({
          stock: response.stock
        })
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

    const cascaderCSS = {width: 210}

    const invoiceSwitcherBtn = this.state.isInvoiceVisible ?
      <Row>
        <Col span={12}>
          <Row type={'flex'} justify={'space-around'}>

            <AddButton tooltip={i18n('invoice.new')} onClick={() => this.setIsInvoiceVisible(false)}><Icon
              type="close-circle"/></AddButton>

            <Cascader style={cascaderCSS} options={null} placeholder={i18n('invoice.blockChoose')}/>

            <AddButton tooltip={i18n('invoice.newBlock')} onClick={() => {
            }}/>

            <Cascader style={cascaderCSS} options={null} placeholder={i18n('invoice.buyerChoose')}/>

            <AddButton tooltip={i18n('invoice.newBuyer')} onClick={() => {
            }}/>
          </Row>
        </Col>
      </Row>
      :
      <AddButton tooltip={i18n('invoice.new')} onClick={() => this.setIsInvoiceVisible(true)}>
        <Icon type="file-sync"/></AddButton>


    const stockContent = this.state.isInvoiceVisible ?
      <Row gutter={8}>
        <Col span={12}>
          <Invoice/>
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
    </div>
  }
}

export default StockPage
