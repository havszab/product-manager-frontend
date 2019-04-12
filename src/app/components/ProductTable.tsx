import * as React from "react";
import i18n from "../libs/i18n";
import {message, Table} from "antd";
import {get, post} from "../libs/utils/request";
import {string} from "prop-types";
import Cascader, {CascaderOptionType} from "antd/es/cascader";

interface ProductTableProps extends React.Props<any> {
  data: Array<Product>
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

    //const statusOptions = this.populateStatuses()

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
         return <Cascader options={this.populateStatuses(product.id)} defaultValue={[product.status]} allowClear={false} onChange={this.handleUnitCascaderChange} style={{width: 100}}/>
        } )
      },
      {
        title: i18n('product.tableData.itemPrice'),
        dataIndex: 'itemPrice',
        render: (value: string, product: Product) => (
          `${product.itemPrice.toLocaleString()} ${currency}`
        )
      },
    ]


    return (
      <div>
        <div>{i18n('product.currentAcquisition')}</div>
        <Table dataSource={this.props.data} columns={columns} />
      </div>)
  }
}

export default ProductTable;
