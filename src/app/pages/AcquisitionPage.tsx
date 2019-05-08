import * as React from "react"
import {Row, Button, message, Col} from 'antd'
import {get, post} from "../libs/utils/request"
import ProductTable from "../components/tables/ProductTable"
import CreateProductCategory from "../components/forms/CreateProductCategory"
import CreateUnitCategory from "../components/forms/CreateUnitCategory"
import CreateProduct from "../components/forms/CreateProduct"
import {user} from "../libs/utils/user"
import PageTitle from "../components/utils/PageTitle"
import Tooltip from "antd/lib/tooltip"
import Icon from "antd/lib/icon"
import {openNotification} from "../libs/utils/notification";

interface Props extends React.Props<any> {
}

interface Acquisition {
  id: number
  owner: User
  products: Array<Product>
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

interface User {
  email: string
  password: string
}

interface Response {
  acquisition?: Acquisition
  productCategories?: Array<ProductCategory>
  unitCategories?: Array<UnitCategory>
}

type State = {
  acquisition?: Acquisition
  productCategories?: Array<ProductCategory>
  unitCategories?: Array<UnitCategory>
  totalPrice?: number
  isCreating: boolean
  isEditing: boolean
  selectedProducts: Array<Product>
  itemToEdit: Product
  isLoading: boolean
}


export default class AcquisitionPage extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      acquisition: new class implements Acquisition {
        id: number;
        owner: User;
        products: Array<Product>;
      },
      isCreating: false,
      isEditing: false,
      selectedProducts: Array<Product>(),
      itemToEdit: new class implements Product {
        description: string;
        id: number;
        itemPrice: number;
        productCategory: ProductCategory;
        quantity: number;
        status: string;
        unitCategory: UnitCategory;
        unitPrice: number;
      },
      isLoading: false
    }
  }

  async componentDidMount(): Promise<void> {
    this.fetchAll()
  }

  fetchAll = async () => {
    await this.fetchAcquisition()
    await this.fetchProductCategories()
    await this.fetchUnitCategories()
  }

  fetchAcquisition = async () => {
    this.setLoading(true)
    await get('get-acquisition', {email: user().email})
      .then((response: { success: boolean, acquisition: Acquisition }) => {
        if (response.success) {
          this.setState({
            acquisition: response.acquisition,
            isEditing: false,
            isCreating: false
          })
        } else {
          message.error('Could not receive data from server!')
        }
      })
      .catch(err => {
        message.error('Could not load data. Message: ' + err)
      })
      .then(() => this.setLoading(false))
    this.getTotalPrice()
  }

  fetchProductCategories = async () => {
    this.setLoading(true)
    await post('get-product-categories')
      .then((response: Response) => {
        this.setState({
          productCategories: response.productCategories
        })
      })
      .then(() => this.setLoading(false))

  }

  fetchUnitCategories = async () => {
    this.setLoading(true)
    await post('get-unit-categories')
      .then((response: Response) => {
        this.setState({
          unitCategories: response.unitCategories
        })
      })
      .then(() => this.setLoading(false))
  }

  getTotalPrice = (): void => {
    let result = 0
    for (let prod of this.state.acquisition.products) {
      result += prod.itemPrice
    }
    this.setState({
      totalPrice: result
    })
  }

  finishAcquisitionHandler = async () => {
    if (this.state.acquisition.products.length <= 0) {
      message.warning("Add items first!")
      return
    }
    this.setLoading(true)
    await post('finish-acquisition', {email: user().email})
      .then((response: { success: boolean, message: string }) => {
        if (response.success) openNotification('success', 'Items moved to stock!', response.message + ' You can find these items under the stock menu.')
        else message.error(response.message)
        this.fetchAll()
      })
      .catch(err => {
        message.error(err)
      })
      .then(() => this.setLoading(false))
  }

  setLoading = (isLoading: boolean) => {
    this.setState({
      isLoading: isLoading
    })
  }

  finishAcquisitionWithSelectedItems = async () => {
    if (this.state.selectedProducts.length <= 0) {
      message.warning("Select items first!")
      return
    }
    this.setLoading(true)
    await post('finish-selected-items', {email: user().email, products: this.state.selectedProducts})
      .then((response: { success: boolean, message: string }) => {
        if (response.success) openNotification('success', 'Items moved to stock!', response.message + ' You can find these items under the stock menu.')
        else message.error(message)
        this.fetchAll()
      })
      .catch(err => {
        message.error(err)
      })
      .then(() => this.setLoading(false))
  }

  removeSelectedItemsFromAcquisition = async () => {
    if (this.state.selectedProducts.length <= 0) {
      message.warning("Select items first!")
      return
    }
    this.setLoading(true)
    await post('remove-selected-items', {email: user().email, products: this.state.selectedProducts})
      .then((response: { success: boolean, message: string }) => {
        if (response.success) message.success(response.message)
        else message.error(message)
        this.fetchAll()
      })
      .catch(err => {
        message.error(err)
      })
      .then(() => this.setLoading(false))
  }

  addItemHandler = () => {
    this.setState({
      isCreating: true,
      isEditing: false
    })
  }

  onEditHandler = (item: Product) => {
    this.setState({
      isEditing: true,
      itemToEdit: item,
      isCreating: false
    })
  }

  addItemCancelHandler = () => {
    this.setState({
      isCreating: false,
      isEditing: false
    })
  }

  addSelectedItems = (products: Array<Product>) => {
    this.setState({
      selectedProducts: products
    })
  }

  render() {

    const total = this.state.totalPrice !== undefined ? this.state.totalPrice.toLocaleString() : 0

    const addItemForm = this.state.isCreating ?
      <CreateProduct productCategories={this.state.productCategories}
                     unitCategories={this.state.unitCategories}
                     onSuccess={this.fetchAcquisition}
                     onCancel={this.addItemCancelHandler}/> :
      <Tooltip placement="topLeft" title="Add new item">
        <Button shape={'round'}
                onClick={this.addItemHandler}
                type={'primary'}
                disabled={this.state.isEditing}
                style={{fontSize: '1em', paddingRight: 8, paddingLeft: 8, paddingTop: 2, margin: 5}}><Icon type="plus"/></Button>
      </Tooltip>

    const editItemForm = this.state.isEditing ?
      <CreateProduct productCategories={this.state.productCategories}
                     unitCategories={this.state.unitCategories}
                     onSuccess={this.fetchAcquisition}
                     onCancel={this.addItemCancelHandler}
                     itemToEdit={this.state.itemToEdit}
      /> : null

    return (
      <div>
        <PageTitle title={'Current acquisition'}/>
        {addItemForm}
        {editItemForm}
        <ProductTable data={this.state.acquisition.products} onSuccess={this.fetchAcquisition}
                      onSelect={this.addSelectedItems} onEdit={this.onEditHandler}/>
        <Row type="flex" justify="space-around">
          <Col span={5}>
          <CreateProductCategory onSuccess={this.fetchProductCategories}/>
          </Col>
          <Col span={5}>
          <CreateUnitCategory onSuccess={this.fetchUnitCategories}/>
          </Col>
          <Col span={12} style={{margin: 5, border: '1px solid #ccc', borderRadius: 7, padding: '10px 15px'}}>
            <h2 style={{borderBottom: '1px solid #ccc'}}>Total: {total} HUF</h2>
            <Button type={"danger"}
                    style={{marginTop: 5, width: '100%'}}
                    onClick={this.removeSelectedItemsFromAcquisition}
                    disabled={this.state.isLoading}>
              {!this.state.isLoading ?
              <div>Remove selected items</div> :
              <div><Icon type="loading"/></div>}
            </Button>
            <Button type={"primary"}
                    style={{marginTop: 5, width: '100%'}}
                    onClick={this.finishAcquisitionWithSelectedItems}
                    disabled={this.state.isLoading}>
              {!this.state.isLoading ?
                <div>Move <span
                  style={{fontWeight: 'bold', padding: '0px 3px', minWidth: 250, fontSize: '1.2em'}}>selected</span> to
                  stock</div> : <div><Icon type="loading"/></div>}
            </Button>
            <Button style={{marginTop: 5, width: '100%'}}
                    onClick={this.finishAcquisitionHandler}
                    disabled={this.state.isLoading}>
              {!this.state.isLoading ?
                <div>Move <span style={{fontWeight: 'bold', padding: '0px 3px', fontSize: '1.2em'}}>all</span> to
                  stock</div> : <div><Icon type="loading"/></div>}
            </Button>
          </Col>
        </Row>
      </div>)

  }
}
