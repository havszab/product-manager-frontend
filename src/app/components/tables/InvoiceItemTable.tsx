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
        title: i18n('product.tableData.product'),
        key: 1
      },
      {
        title: i18n('product.tableData.unitPrice'),
        key: 2
      },
      {
        title: i18n('product.value'),
        key: 3
      },
      {
        title: 'ÁFA',
        key: 4
      },
      {
        title: 'ÁFA összege',
        key: 5
      },
      {
        title: i18n('product.tableData.totalPrice'),
        key: 6
      }
    ]

    return (
      <div>
        <Table columns={columns}
               size={'small'}
               bordered={true}
               locale={{ emptyText: <Empty description={i18n('statusMessage.dataMissing')}/> }}
               rowKey={record => {return record.toString()}}
        />
      </div>
    )
  }

}

export default InvoiceItemTable
