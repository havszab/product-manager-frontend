import * as React from "react";
import {Table} from "antd";
import i18n from "../libs/i18n";
import PageTitle from "./PageTitle";
import {post} from "../libs/utils/request";

type props = {
  data: Array<Product>
}

type state = {
  productCategories?: Array<ProductCategory>
  filters?: Array<FilterItem>
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

interface FilterItem {
  text: string
  value: string
}

interface Response {
  productCategories: Array<ProductCategory>
}


class SalesTable extends React.Component<props, state> {


  state = {
    productCategories: Array<ProductCategory>(),
    filters: Array<FilterItem>()
  }


  async componentDidMount (): Promise<void> {
    await this.fetchProductCategories()
    this.setState({
      filters: this.getProductCategoryFilters()
    })
  }

  getProductCategoryFilters = (): Array<FilterItem> => {
    let filters: FilterItem[] = []
    if (this.state.productCategories) {
      for (let category of this.state.productCategories) {
        console.log(this.state.productCategories)
        filters.push({
          text: category.productName,
          value: category.productName
        })
      }
    }
    console.log(filters)
    return filters
  }

  fetchProductCategories = async () => {
    await post('get-product-categories')
      .then((response: Response) => {
        this.setState({
          productCategories: response.productCategories
        })
      })
  }

  render() {

    const currency = 'HUF'

    const filters = this.state.filters

    const columns = [
      {
        title: 'Product',
        dataIndex: 'productCategory.productName',
        filters: filters,
        onFilter: (value: string, record: Product) => record.productCategory.productName.indexOf(value) === 0,
      },
      {
        title: i18n('product.tableData.quantity'),
        dataIndex: 'quantity',
        render: (value: string, product: Product) => (
          `${product.quantity.toLocaleString()} ${product.unitCategory.unitName}`
        ),
        sorter: (a: Product, b: Product) => a.quantity - b.quantity
      },
      {
        title: 'Purchase value',
        dataIndex: 'itemPrice',
        render: (value: string, product: Product) => (
          `${product.itemPrice.toLocaleString()} ${currency}`
        ),
        sorter: (a: Product, b: Product) => a.itemPrice - b.itemPrice

      },
      {
        title: 'Sold for ',
        dataIndex: 'sellingPrice',
        render: (value: string, product: Product) => (
          `${product.sellingPrice.toLocaleString()} ${currency}`
        ),
        sorter: (a: Product, b: Product) => a.sellingPrice - b.sellingPrice
      },
      {
        title: 'Profit',
        dataIndex: 'profit',
        render: (value: string, product: Product) => {
          return <div
            style={{color: product.profit >= 0 ? '#52c41a' : '#f5222d'}}>{product.profit.toLocaleString()} {currency}</div>
        },
        sorter: (a: Product, b: Product) => a.profit - b.profit
      },
      {
        title: 'Sold on ',
        dataIndex: 'sellingDate',
        render: (value: string, product: Product) => (
          `${new Date(product.sellingDate).toLocaleDateString()}`
        ),
        sorter: (a: Product, b: Product) => {
          let date1 = new Date(a.sellingDate)
          let date2 = new Date(b.sellingDate)
          return date1.getDate() - date2.getDate()
        }
      }
    ]

    return <div>
      <PageTitle title={'SALES HISTORY'}/>
      <Table rowKey={record => {return record.id.toString()}} dataSource={this.props.data} columns={columns} bordered={true}/>
    </div>
  }
}

export default SalesTable;
