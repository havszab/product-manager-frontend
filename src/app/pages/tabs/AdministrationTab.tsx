import React from "react";
import {post} from "../../libs/utils/request";
import ListCategories from "../../components/ListCategories";
import Row from "antd/lib/grid/row";

type props = {}
type state = {
  productCategories?: Array<Category>
  unitCategories?: Array<Category>
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
    unitCategories: Array<Category>()
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
    return (
      <div>
        <Row type={"flex"} justify={'space-around'}>
          <ListCategories title={'Manage product categories'} categories={this.state.productCategories} />
          <ListCategories title={'Manage unit categories'} categories={this.state.unitCategories} />
        </Row>
      </div>
    )
  }

}

export default AdministrationTab;
