import * as React from "react";
import ProductTable from "../components/ProductTable";
import {post} from "../libs/utils/request";
import {user} from "../libs/utils/user";
import {Modal} from 'antd'
import ItemSell from "../components/forms/ItemSellForm";
import PageTitle from "../components/PageTitle";

interface StockPageProps extends React.Props <any> {
}

type state = {
  stock: Stock
  isModalVisible: boolean
  prodToSell?: Product
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
      isModalVisible: false
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

  render() {

    const modalOnSell = this.state.prodToSell ? (
      <Modal visible={this.state.isModalVisible}
             footer={null}
             centered={true}
             onCancel={this.modalCancelHandler}>
        <ItemSell product={this.state.prodToSell}
                  onCancel={this.modalCancelHandler}
                  onSubmit={this.onSellFormSubmitHandler}/>
      </Modal>) : null


    return <div>
      <PageTitle title={'Products in stock'}/>
      <ProductTable data={this.state.stock.products} stockOperations={true} onSell={this.handleSell}/>
      {modalOnSell}
    </div>
  }
}

export default StockPage;
