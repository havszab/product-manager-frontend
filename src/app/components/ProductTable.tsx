import * as React from "react";
import i18n from "../libs/i18n";
import {message, Table} from "antd";
import {get, post} from "../libs/utils/request";
import Cascader, {CascaderOptionType} from "antd/es/cascader";

interface ProductTableProps extends React.Props<any> {
  data: Array<Product>
  stockOperations?: boolean
  onSell?: (product:Product) => void
}

type state = {
  statuses: Array<string>
}

interface Response {
  statuses: Array<string>
}

interface Product {
  id: number
  description?: string
  itemPrice: number
  unitPrice: number
  quantity: number
  status: string
  productCategory: ProductCategory,
  unitCategory: UnitCategory,
  selling_date?: Date
}

interface ProductCategory {
  id: number
  productName: string
}

interface UnitCategory {
  id: number
  unitName: string
}

class ProductTable extends React.Component<ProductTableProps, state> {
  constructor(props: ProductTableProps) {
    super(props)

    this.state = {
      statuses: Array<string>()
    }
  }

  async componentDidMount(): Promise<void> {
    await get('get-all-status')
      .then((response: Response) => {
        this.setState({
          statuses: response.statuses
        })
      })
  }

  populateStatuses = (id:number) : CascaderOptionType[] => {
    let statuses: CascaderOptionType[] = []
    if (this.state.statuses.length !== 0) {
      for (let status of this.state.statuses) {
        statuses.push({
          label: status,
          value: JSON.stringify({status: status, id: id})
        })
      }
    }
    return statuses
  }

  handleUnitCascaderChange = async (value: string[], selectedOptions: CascaderOptionType[]) => {
    const status = JSON.parse(selectedOptions[0].value)
    await post('set-product-status', status)
      .then(response => {
        message.success(response)
      })
      .catch(err => {
        message.error(err)
      })

  }

  render() {
    const currency = 'HUF'

    const sellColumn = this.props.stockOperations ? {
      title: 'Sell',
      render: (text: string, product: Product) => (
        this.props.data.length >= 1
          ? (
              <a onClick={() => this.props.onSell(product)}>Sell</a>
          ):{}
      )
    }:{}

    const columns = [
      {
        title: i18n('product.tableData.product'),
        dataIndex: 'productCategory.productName',
      },
      {
        title: i18n('product.tableData.quantity'),
        dataIndex: 'quantity',
        render: (value: string, product: Product) => (
          `${product.quantity.toLocaleString()} ${product.unitCategory.unitName}`
        )
      },
      {
        title: i18n('product.tableData.unitPrice'),
        dataIndex: 'unitPrice',
        render: (value: string, product: Product) => (
          `${product.unitPrice.toLocaleString()} ${currency}`
        )
      },
      {
        title: i18n('product.tableData.status'),
        dataIndex: 'status',
        render: ((value: string, product: Product):React.ReactNode => {
         return <Cascader options={this.populateStatuses(product.id)}
                          defaultValue={[product.status]}
                          allowClear={false}
                          onChange={this.handleUnitCascaderChange}
                          style={{width: 100}}/>
        } )
      },
      {
        title: i18n('product.tableData.itemPrice'),
        dataIndex: 'itemPrice',
        render: (value: string, product: Product) => (
          `${product.itemPrice.toLocaleString()} ${currency}`
        )
      },
      sellColumn
    ]

    return (
      <div style={{marginTop: 10}}>
        <Table rowKey={record => {return record.id.toString()}} dataSource={this.props.data} columns={columns} />
      </div>)
  }
}

export default ProductTable;
