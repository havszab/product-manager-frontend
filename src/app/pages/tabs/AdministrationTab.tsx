import React from "react";
import {get, post} from "../../libs/utils/request";
import ListCategories from "../../components/ListCategories";
import Row from "antd/lib/grid/row";
import {Button, Col, Icon} from "antd";
import {user} from "../../libs/utils/user";
import UtilButton from '../../components/utils/UtilButton'

type props = {}
type state = {
  productCategories?: Array<Category>
  unitCategories?: Array<Category>
  isExtended: boolean
}

interface Category {
  id: number
  name: string
}

interface ProductCategory {
  id: number
  productName: string
}

interface UnitCategory {
  id: number
  unitName: string
}

class AdministrationTab extends React.Component<props, state> {
  state = {
    productCategories: Array<Category>(),
    unitCategories: Array<Category>(),
    isExtended: false
  }

  componentDidMount(): void {
    this.fetchCategories()
  }

  fetchCategories = async () => {
    this.fetchProductCategories()
    this.fetchUnitCategories()
  }

  fetchProductCategories = async () => {
    await get('get-product-categories', {email: user().email})
      .then((response: {productCategories: Array<ProductCategory>}) => {
        this.setState({
          productCategories: this.mapProductCategoryToCategory(response.productCategories)
        })
      })
  }

  fetchUnitCategories = async () => {
    await get('get-unit-categories', {email: user().email})
      .then((response: {unitCategories: Array<UnitCategory>}) => {
        this.setState({
          unitCategories: this.mapUnitCategoryToCategory(response.unitCategories)
        })
      })
  }

  mapProductCategoryToCategory = (prodCats: Array<ProductCategory>): Array<Category> => {
    let categories = Array<Category>()
    for (let prodCat of prodCats) {
      categories.push({
        id: prodCat.id,
        name: prodCat.productName
      })
    }
    return categories;
  }

  isExtendedSwitcher = (isExtended: boolean) => {
    this.setState({
      isExtended: isExtended
    })
  }

  mapUnitCategoryToCategory = (unitCats: Array<UnitCategory>): Array<Category> => {
    let categories = Array<Category>()
    for (let unitCat of unitCats) {
      categories.push({
        id: unitCat.id,
        name: unitCat.unitName
      })
    }
    return categories;
  }

  render() {

    const btnStyle = {fontSize: '1em', paddingRight: 6, paddingLeft: 6, paddingTop: 2, margin: 5}

    const expandButton = this.state.isExtended ?
      <UtilButton tooltip={''} onClick={() => this.isExtendedSwitcher(false)}><Icon type={'up-circle'}/></UtilButton> :
      <UtilButton tooltip={''} onClick={() => this.isExtendedSwitcher(true)}><Icon type={'down-circle'}/></UtilButton>


    return (
      <div>
        <Row type={"flex"} justify={'space-around'}>
          <Col span={8} >
          <ListCategories title={'Manage product categories'} isExtended={this.state.isExtended} categories={this.state.productCategories} categoryInstance={'PRODUCT'}/>
          </Col>
          <Col span={2}>
          {expandButton}
          </Col>
          <Col span={8}>
          <ListCategories title={'Manage unit categories'} isExtended={this.state.isExtended} categories={this.state.unitCategories} categoryInstance={'UNIT'}/>
          </Col>
        </Row>
      </div>
    )
  }

}

export default AdministrationTab;
