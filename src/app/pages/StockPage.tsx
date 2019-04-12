import * as React from "react";
import ProductTable from "../components/ProductTable";
import {post} from "../libs/utils/request";
import {user} from "../libs/utils/user";

interface StockPageProps extends React.Props <any> {
}

type state = {
  stock: Stock
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
        id: number;
        owner: User;
        products: Array<Product>;
      }
    }
  }

  async componentDidMount(): Promise<void> {
    await post('get-stock', user())
      .then((response: Response) => {
        this.setState({
          stock: response.stock
        })
      })
  }


  render() {
    return <div>
      <ProductTable data={this.state.stock.products}/>
    </div>
  }
}

export default StockPage;
