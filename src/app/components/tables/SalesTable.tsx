import * as React from "react"
import {Empty, Table} from "antd"
import i18n from "../../libs/i18n"
import PageTitle from "../utils/PageTitle"
import {get, post} from "../../libs/utils/request"
import {user} from "../../libs/utils/user"

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


  async componentDidMount(): Promise<void> {
    await this.fetchProductCategories()
    this.setState({
      filters: this.getProductCategoryFilters()
    })
  }

  getProductCategoryFilters = (): Array<FilterItem> => {
    let filters: FilterItem[] = []
    if (this.state.productCategories) {
      for (let category of this.state.productCategories) {
        filters.push({
          text: category.productName,
          value: category.productName
        })
      }
    }
    return filters
  }

  fetchProductCategories = async () => {
    await get('get-product-categories', {email: user().email})
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
        title: i18n('sales.table.product'),
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
        title: i18n('sales.table.value'),
        dataIndex: 'itemPrice',
        render: (value: string, product: Product) => (
          `${product.itemPrice.toLocaleString()} ${currency}`
        ),
        sorter: (a: Product, b: Product) => a.itemPrice - b.itemPrice

      },
      {
        title: i18n('sales.table.soldFor'),
        dataIndex: 'sellingPrice',
        render: (value: string, product: Product) => (
          `${product.sellingPrice.toLocaleString()} ${currency}`
        ),
        sorter: (a: Product, b: Product) => a.sellingPrice - b.sellingPrice
      },
      {
        title: i18n('product.profit'),
        dataIndex: 'profit',
        render: (value: string, product: Product) => {
          return <div
            style={{color: product.profit >= 0 ? '#52c41a' : '#f5222d'}}>{product.profit.toLocaleString()} {currency}</div>
        },
        sorter: (a: Product, b: Product) => a.profit - b.profit
      },
      {
        title: i18n('sales.table.soldOn'),
        dataIndex: 'sellingDate',
        render: (value: string, product: Product) => (
          `${new Date(product.sellingDate).toLocaleDateString()}`
        ),
        sorter: (a: Product, b: Product) => {
          let date1 = new Date(a.sellingDate)
          let date2 = new Date(b.sellingDate)
          return date1.getTime() - date2.getTime()
        }
      }
    ]

    return <div>
      <Table
        rowKey={record => {
          return record.id.toString()
        }}
        dataSource={this.props.data}
        columns={columns}
        bordered={true}
        locale={{emptyText: <Empty description={i18n('statusMessage.dataMissing')}/>}}
      />
    </div>
  }
}

export default SalesTable
