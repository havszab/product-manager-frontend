import * as React from "react";
import i18n from "../../libs/i18n";
import {message, Table, Cascader, Icon, Empty} from "antd"
import {get, post} from "../../libs/utils/request";
import {CascaderOptionType} from "antd/es/cascader";
import {user} from "../../libs/utils/user";
import {TableSize} from 'antd/es/table'

interface ProductTableProps extends React.Props<any> {
  data: Array<Product>
  stockOperations?: boolean
  onSell?: (product: Product) => void
  onEdit?: (product: Product) => void
  onSelect?: (products: Array<Product>) => void
  onSuccess?: () => void
  size?: TableSize
}

type state = {
  statuses: Array<string>
  productCategories?: Array<ProductCategory>
  statusFilter: Array<FilterItem>
  categoryFilter: Array<FilterItem>
  statusEditId?: number
}

interface FilterItem {
  text: string
  value: string
}

interface Response {
  statuses: Array<string>
  productCategories: Array<ProductCategory>,
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
      statuses: Array<string>(),
      productCategories: Array<ProductCategory>(),
      statusFilter: Array<FilterItem>(),
      categoryFilter: Array<FilterItem>(),
      statusEditId: -1
    }
  }

  async componentDidMount(): Promise<void> {
    await this.fetchStatuses()
    await this.fetchProductCategories()
    this.setState({
      categoryFilter: this.getProductCategoryFilters(),
      statusFilter: this.getStatusFilters()
    })
  }

  populateStatuses = (id: number): CascaderOptionType[] => {
    let statuses: CascaderOptionType[] = []
    if (this.state.statuses.length !== 0) {
      for (let status of this.state.statuses) {
        statuses.push({
          label: i18n('status.' + status.toLowerCase()),
          value: JSON.stringify({status: status, id: id}),
          disabled: status === 'IN_STOCK' && !this.props.stockOperations
        })
      }
    }
    return statuses
  }

  fetchStatuses = async () => {
    await get('get-all-status')
      .then((response: { success: boolean, statuses: Array<string> }) => {
        if (response.success) {
          this.setState({
            statuses: response.statuses,
            statusFilter: this.getStatusFilters()
          })
        } else message.error('Could not load product statuses!')
      })
      .catch(err => {
        message.error('Could not load product statuses! Reason: ' + err)
      })
  }

  fetchProductCategories = async () => {
    await get('get-product-categories', {email: user().email})
      .then((response: Response) => {
        this.setState({
          productCategories: response.productCategories,
          categoryFilter: this.getProductCategoryFilters(),
        })
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

  getStatusFilters = (): Array<FilterItem> => {
    let filters: FilterItem[] = []
    if (this.state.statuses) {
      for (let status of this.state.statuses) {
        filters.push({
          text: status,
          value: status
        })
      }
    }
    return filters
  }

  activateStatusEditor = (id: number) => {
    this.setState({
      statusEditId: id
    })
  }

  handleUnitCascaderChange = async (value: string[], selectedOptions: CascaderOptionType[]) => {
    const status = JSON.parse(selectedOptions[0].value)
    console.log(status)
    await post('set-product-status', status)
      .then((response: { success: boolean}) => {
        if (response.success) {
          message.success(i18n('status.changed'))
        } else message.error(i18n('statusMessage.operationFailed'))
      })
      .catch(err => {
        message.error(i18n('statusMessage.operationFailed') + ' ' + err)
      })
    this.setState({
      statusEditId: -1
    })
    this.props.onSuccess()
  }


  render() {
    const currency = 'HUF'

    const utilCol = this.props.stockOperations ? {
      title:  i18n('product.tableData.sell'),
      render: (text: string, product: Product) => (
        this.props.data.length >= 1
          ? (
            <a onClick={() => this.props.onSell(product)}>{i18n('product.tableData.sell')}</a>
          ) : {}
      )
    } : {
      title:  i18n('product.tableData.edit'),
      render: (text: string, product: Product) => (
        this.props.data.length >= 1 ? (
          <a onClick={() => this.props.onEdit(product)}><Icon type={'edit'}/></a>
        ) : {}
      )
    }

    const rowSelection = !this.props.stockOperations ? {
      onChange: (selectedRowKeys: any, selectedRows: Array<Product>) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
        this.props.onSelect(selectedRows)
      }
    } : null


    const filters = this.state.categoryFilter
    const statusFilters = this.state.statusFilter

    const columns = !this.props.size ? [
      {
        title: i18n('product.tableData.product'),
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
        title: i18n('product.tableData.unitPrice'),
        dataIndex: 'unitPrice',
        render: (value: string, product: Product) => (
          `${product.unitPrice.toLocaleString()} ${currency} / ${product.unitCategory.unitName}`
        ),
        sorter: (a: Product, b: Product) => a.unitPrice - b.unitPrice
      },
      {
        title: i18n('product.tableData.status'),
        dataIndex: 'status',
        render: ((value: string, product: Product): React.ReactNode => {
          return this.state.statusEditId === product.id ?
            <div onDoubleClick={() => this.activateStatusEditor(-1)}>
            <Cascader options={this.populateStatuses(product.id)}
                      defaultValue={[product.status]}
                      allowClear={false}
                      onChange={this.handleUnitCascaderChange}
                      size={'small'}
                      style={{width: 100}}

            /></div> : <div onClick={() => this.activateStatusEditor(product.id)}>{i18n('status.' + product.status.toLowerCase())}</div>
        }),
        filters: statusFilters,
        onFilter: (value: string, record: Product) => record.status.indexOf(value) === 0,
      },
      {
        title: i18n('product.tableData.itemPrice'),
        dataIndex: 'itemPrice',
        render: (value: string, product: Product) => (
          `${product.itemPrice.toLocaleString()} ${currency}`
        ),
        sorter: (a: Product, b: Product) => a.itemPrice - b.itemPrice
      },
      utilCol
    ] :
      [
        {
          title: i18n('product.tableData.product'),
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
          title: i18n('product.tableData.unitPrice'),
          dataIndex: 'unitPrice',
          render: (value: string, product: Product) => (
            `${product.unitPrice.toLocaleString()} ${currency} / ${product.unitCategory.unitName}`
          ),
          sorter: (a: Product, b: Product) => a.unitPrice - b.unitPrice
        },
        {
          title: i18n('product.tableData.itemPrice'),
          dataIndex: 'itemPrice',
          render: (value: string, product: Product) => (
            `${product.itemPrice.toLocaleString()} ${currency}`
          ),
          sorter: (a: Product, b: Product) => a.itemPrice - b.itemPrice
        },
        utilCol
      ]

    return (
      <div style={{marginTop: 10}}>
        <Table rowSelection={rowSelection}
               rowKey={record => {return record.id.toString()}}
               dataSource={this.props.data} columns={columns}
               size={this.props.size}
               bordered={this.props.size==='small'}
               pagination={this.props.size==='small'? {position:'both'}:{position:'bottom'}}
               locale={{ emptyText: <Empty description={i18n('statusMessage.dataMissing')}/> }}
        />
      </div>)
  }
}

export default ProductTable;
