import React from "react"
import {Empty, Table} from 'antd'
import i18n from '../../libs/i18n'
import {TableSize} from 'antd/lib/table'

type props = {
  items: Array<Product>
  size: TableSize
}
type state = {}

interface Product {
  id: number
  description?: string
  itemPrice?: number
  unitPrice: number
  quantity: number
  status?: string
  productCategory: ProductCategory,
  unitCategory: UnitCategory,
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

class InvoiceItemTable extends React.Component<props, state> {
  state = {}

  render() {

    const currency = 'HUF'

    const columns = this.props.size === 'middle' ? [
      {
        title: i18n('product.tableData.product'),
        dataIndex: 'productCategory.productName',
      },
      {
        title: i18n('product.tableData.unitPrice'),
        dataIndex: 'unitPrice',
        render: (value: string, product: Product) => (
          `${Math.round(product.unitPrice).toLocaleString()} ${currency}`
        ),
      },
      {
        title: i18n('product.tableData.unit'),
        dataIndex: 'unitCategory.unitName'
      },
      {
        title: i18n('product.tableData.quantity'),
        dataIndex: 'quantity'
      },
      {
        title: i18n('product.value'),
        dataIndex: 'sellingPrice',
        render: (value: string, product: Product) => (
          `${product.sellingPrice.toLocaleString()} ${currency}`
        ),
      },
      {
        title: i18n('invoice.vat'),
        dataIndex: 'taxKey',
        render: (value: string, product: Product) => (
          `${product.taxKey}%`
        ),
      },
      {
        title: i18n('invoice.taxAmount'),
        dataIndex: 'taxAmount',
        render: (value: string, product: Product) => (
          `${product.taxAmount.toLocaleString()} ${currency}`
        ),
      },
      {
        title: i18n('product.tableData.totalPrice'),
        dataIndex: 'totalAmount',
        render: (value: string, product: Product) => (
          `${product.totalAmount.toLocaleString()} ${currency}`
        ),
      }
    ] : [
      {
        title: i18n('product.tableData.product'),
        dataIndex: 'productCategory.productName',
      },
      {
        title: i18n('product.tableData.unitPrice'),
        dataIndex: 'unitPrice',
        render: (value: string, product: Product) => (
          `${Math.round(product.unitPrice).toLocaleString()}`
        ),
      },
      {
        title: i18n('product.tableData.quant'),
        dataIndex: 'quantity'
      },
      {
        title: i18n('product.tableData.unit'),
        dataIndex: 'unitCategory.unitName'
      },
      {
        title: i18n('product.value'),
        dataIndex: 'sellingPrice',
        render: (value: string, product: Product) => (
          `${product.sellingPrice.toLocaleString()}`
        ),
      },
      {
        title: i18n('invoice.vat'),
        dataIndex: 'taxKey',
        render: (value: string, product: Product) => (
          `${product.taxKey}%`
        ),
      },
      {
        title: i18n('product.tableData.totalPrice'),
        dataIndex: 'totalAmount',
        render: (value: string, product: Product) => (
          `${product.totalAmount.toLocaleString()}`
        ),
      }
    ]

    return (
      <div>
        <Table columns={columns}
               dataSource={this.props.items}
               bordered={true}
               locale={{emptyText: <Empty description={i18n('statusMessage.dataMissing')}/>}}
               rowKey={record => {
                 return '#' + record.id + record.taxKey + record.quantity
               }}
               size={this.props.size}
        />
      </div>
    )
  }

}

export default InvoiceItemTable
