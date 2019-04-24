import * as React from "react";
import {post} from "../libs/utils/request";
import {user} from "../libs/utils/user";
import ProductTable from "../components/tables/ProductTable";
import SalesTable from "../components/tables/SalesTable";

type props = {}
type state = {
  sales: Sales
}

interface Response {
  sales: Sales
}

interface Sales {
  id: number
  products: Array<Product>
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
  sellingDate?: Date
  sellingPrice: number
  profit: number
}

interface ProductCategory {
  id: number
  productName: string
}

interface UnitCategory {
  id: number
  unitName: string
}

class SalesPage extends React.Component<props, state> {
  constructor(props: props) {
    super(props)

    this.state = {
      sales: new class implements Sales {
        id: number;
        products: Array<Product>;
      }
    }
  }

  componentDidMount(): void {
    this.fetchSales()
  }

  fetchSales = async () => {
    await post('get-sales', user())
      .then((response: Response) => {
        this.setState({
          sales: response.sales
        })
      })
  }

  render() {
    return <div>
      <SalesTable data={this.state.sales.products}/>
    </div>
  }
}

export default SalesPage;
