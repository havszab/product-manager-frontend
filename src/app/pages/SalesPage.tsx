import * as React from "react";
import {get, post} from "../libs/utils/request";
import {user} from "../libs/utils/user";
import SalesTable from "../components/tables/SalesTable";
import Tabs from "antd/lib/tabs";
import TimeRangeSwitcher from "../components/utils/TimeRangeSwitcher";
import moment = require("moment");
import {Icon} from "antd";
import PageTitle from "../components/utils/PageTitle";
import i18n from '../libs/i18n'

type props = {}
type state = {
  sales: Sales
  monthlySales: Array<Product>
  dateFrom: Date
  dateTo: Date
}

const TabPane = Tabs.TabPane;

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

interface SqlFormattedProduct {
  id: number
  item_price: number
  unit_price: number
  quantity: number
  status: string
  product_category_id: number
  product_name: string
  unit_category_id: number
  unit_name: string
  selling_date: Date
  selling_price: number
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
      },
      monthlySales: Array<Product>(),
      dateFrom: moment().month(new Date().getMonth()).startOf("month").toDate(),
      dateTo: moment().month(new Date().getMonth()).endOf("month").toDate(),
    }
  }

  componentDidMount(): void {
    this.fetchAll()
  }

  fetchAll = () => {
    this.fetchSales()
    this.fetchThisMonthProducts()
  }

  fetchSales = async () => {
    await post('get-sales', user())
      .then((response: Response) => {
        this.setState({
          sales: response.sales
        })
      })
  }

  timeRangeUpdateHandler = (from: Date, to: Date) => {
    this.setState({
      dateFrom: from,
      dateTo: to
    })
    this.fetchAll()
  }

  fetchThisMonthProducts = async () => {
    await get('get-monthly-sold-products', {from: this.state.dateFrom.getTime(), to: this.state.dateTo.getTime(), email: user().email})
      .then((res: {result: Array<SqlFormattedProduct>}) => {
        let mappedResult = this.mapSqlResponseToProducts(res.result)
        this.setState({
          monthlySales: mappedResult
        })
      })
  }

  mapSqlResponseToProducts = (sqlSource: Array<SqlFormattedProduct>): Array<Product> => {
    let result = Array<Product>()
    for (let prod of sqlSource) {
      let mappedProdCat: ProductCategory = new class implements ProductCategory {
        id = prod.product_category_id
        productName = prod.product_name;
      }
      let mappedUnitCat: UnitCategory = new class implements UnitCategory {
        id = prod.unit_category_id
        unitName = prod.unit_name
      }
      let mappedProd: Product = new class implements Product {
        id = prod.id
        itemPrice  = prod.item_price
        productCategory = mappedProdCat
        profit = prod.profit
        quantity = prod.quantity
        sellingDate = prod.selling_date
        sellingPrice = prod.selling_price
        status = prod.status
        unitCategory = mappedUnitCat
        unitPrice = prod.unit_price
      }
      result.push(mappedProd)
    }
    return result
  }

  render() {
    return <div>
      <PageTitle title={i18n('sales.title')}/>
      <Tabs type="card">
        <TabPane tab={<div><Icon type="table"/>{i18n('tabs.overview')}</div>} key={"1"}>
          <SalesTable data={this.state.sales.products}/>
        </TabPane>
        <TabPane tab={<div><Icon type="calendar"/>{i18n('tabs.monthly')}</div>} key={"2"}>
          <TimeRangeSwitcher returnRange={this.timeRangeUpdateHandler}/>
          <SalesTable data={this.state.monthlySales}/>
        </TabPane>
      </Tabs>
    </div>
  }
}

export default SalesPage;
