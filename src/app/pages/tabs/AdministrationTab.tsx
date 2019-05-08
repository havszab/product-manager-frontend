import React from "react";
import {post} from "../../libs/utils/request";
import ListCategories from "../../components/ListCategories";
import Row from "antd/lib/grid/row";
import {Button, Col, Icon} from "antd";

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
    await post('get-product-categories')
      .then((response: {productCategories: Array<ProductCategory>}) => {
        this.setState({
          productCategories: this.mapProductCategoryToCategory(response.productCategories)
        })
      })
  }

  fetchUnitCategories = async () => {
    await post('get-unit-categories')
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
      <Button type={'primary'} shape={"round"} style={btnStyle} onClick={() => this.isExtendedSwitcher(false)}><Icon type={'up-circle'}/></Button> :
      <Button type={'primary'} shape={"round"} style={btnStyle} onClick={() => this.isExtendedSwitcher(true)}><Icon type={'down-circle'}/></Button>


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
