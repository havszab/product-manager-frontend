import * as React from "react"
import {Row, Button, message} from 'antd'
import {get, post} from "../libs/utils/request"
import i18n from "../libs/i18n"
import ProductTable from "../components/tables/ProductTable";
import CreateProductCategory from "../components/forms/CreateProductCategory";
import CreateUnitCategory from "../components/forms/CreateUnitCategory";
import CreateProduct from "../components/forms/CreateProduct";
import {user} from "../libs/utils/user";
import NumberFormat from 'react-number-format'
import PageTitle from "../components/utils/PageTitle";
import Tooltip from "antd/lib/tooltip";

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
      isEditing: false
    }
  }

  async componentDidMount(): Promise<void> {
    this.fetchAcquisition()
    this.fetchProductCategories()
    this.fetchUnitCategories()
  }

  fetchAcquisition = async () => {
    await post('get-acquisition', JSON.parse(localStorage.getItem('user')))
      .then((response: Response) => {
        this.setState({
          acquisition: response.acquisition
        })
      })
    this.getTotalPrice()
  }

  fetchProductCategories = async () => {
    await post('get-product-categories')
      .then((response: Response) => {
        this.setState({
          productCategories: response.productCategories
        })
      })
  }

  fetchUnitCategories = async () => {
    await post('get-unit-categories')
      .then((response: Response) => {
        this.setState({
          unitCategories: response.unitCategories
        })
      })
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
    let req = {
      email: user().email
    }
    await post('finish-acquisition', req)
      .then(response => {
        message.success(response)
        this.fetchAcquisition()
      })
      .catch(err => {
        message.error(err)
      })
  }

  addItemHandler = () => {
    this.setState({
      isCreating: true
    })
  }

  addItemCancelHandler = () => {
    this.setState({
      isCreating: false
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
      <Button shape={'round'} onClick={this.addItemHandler} type={'primary'} style={{height: 45, width: 45, fontSize: '1.3em'}} >+</Button>
      </Tooltip>
    return (
      <div>
        <PageTitle title={'Current acquisition'}/>
        {addItemForm}
        <ProductTable data={this.state.acquisition.products}/>
        <Row type="flex" justify="space-around">
          <CreateProductCategory onSuccess={this.fetchProductCategories}/>
          <CreateUnitCategory onSuccess={this.fetchUnitCategories}/>
          <div style={{margin: 5, border: '1px solid #ccc', borderRadius: 7, padding: '10px 15px'}}>
            <h2 style={{borderBottom: '1px solid #ccc'}}>Total: {total} HUF</h2>
            <Button type={"primary"} style={{marginTop: 70, width: '100%'}} onClick={this.finishAcquisitionHandler}>Complete
              acquisition</Button>
          </div>
        </Row>
      </div>)

  }
}
