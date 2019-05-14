import React from "react"
import {Empty, Table} from 'antd'
import i18n from '../../libs/i18n'

type props = {}
type state = {}

class InvoiceItemTable extends React.Component<props, state> {
  state = {}

  render() {

    const columns = [
      {
        title: i18n('product.tableData.product')
      },
      {
        title: i18n('product.tableData.unitPrice')
      },
      {
        title: i18n('product.value')
      },
      {
        title: 'ÁFA'
      },
      {
        title: 'ÁFA összege'
      },
      {
        title: i18n('product.tableData.totalPrice')
      }
    ]

    return (
      <div>
        <Table columns={columns}
               size={'small'}
               bordered={true}
               locale={{ emptyText: <Empty description={i18n('statusMessage.dataMissing')}/> }}/>
      </div>
    )
  }

}

export default InvoiceItemTable
