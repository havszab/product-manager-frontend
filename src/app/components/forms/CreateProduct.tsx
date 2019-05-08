import * as React from "react";
import {Form, Button, Row, Cascader, message, Icon} from 'antd'
import {WrappedFormUtils} from "antd/lib/form/Form";
import addFormItem from "../../libs/forms/addFormItem";
import i18n from "../../libs/i18n";
import {post} from "../../libs/utils/request";
import {user} from "../../libs/utils/user";
import Tooltip from "antd/lib/tooltip";

interface CreateProductProps extends React.Props<any> {
  form: WrappedFormUtils
  productCategories?: Array<Category>
  unitCategories?: Array<Category>
  onSuccess?: () => void
  onCancel: () => void
  itemToEdit?: Product
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


interface Option {
  label: string
  value: string
}

interface Category {
  id: number
  productName?: string
  unitName?: string
}

interface SaveRequestBody {
  email: string
  name: string
  price: number
  quantity: number
  unit: string
  description?: string
  id?: number
}

interface State {
  selectedProd?: Category
  selectedUnit?: Category
}

class CreateProduct extends React.Component<CreateProductProps, State> {
  constructor(props: CreateProductProps) {
    super(props)

    this.state = {}
  }

  async componentDidMount(): Promise<void> {
    if (this.props.itemToEdit) {
      this.props.form.setFieldsValue(this.props.itemToEdit)
      this.setState({
        selectedProd: this.props.itemToEdit.productCategory,
        selectedUnit: this.props.itemToEdit.unitCategory
      })
    }
  }

  mapCategoriesToOptions = (categories: Array<Category>): Array<Option> => {
    let options = Array<Option>()
    if (categories !== undefined) {
      for (let cat of categories) {
        let option: Option = {
          label: cat.productName ? cat.productName : cat.unitName,
          value: JSON.stringify(cat)
        }
        options.push(option)
      }
    }
    return options
  }

  handleSubmit = (e: any): void => {
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      let body: SaveRequestBody = values
      body.email = user().email
      body.price = values.itemPrice
      body.name = this.state.selectedProd.productName
      body.unit = this.state.selectedUnit.unitName
      console.log(body)
      if (!this.props.itemToEdit) {
      await post('add-item', body)
        .then((response: { success: boolean, message: string }) => {
          if (response.success) {
            message.success(response.message)
            this.props.onSuccess()
            this.props.form.resetFields()
          } else message.error(response.message)
        })
        .catch(e => {
          message.error("Could not add item to acquisition! Reason: " + e)
        })
      } else {
        body.id = this.props.itemToEdit.id
        await post('edit-item', body)
          .then((response: { success: boolean, message: string }) => {
            if (response.success) {
              message.success(response.message)
              this.props.onSuccess()
              this.props.form.resetFields()
            } else message.error(response.message)
          })
          .catch(e => {
            message.error("Could not edit item! Reason: " + e)
          })
      }
    })
  }

  handleProdCascaderChange = (value: string[], selectedOptions: Option[]) => {
    const category: Category = JSON.parse(selectedOptions[0].value)
    this.setState({
      selectedProd: category
    })
  }

  handleUnitCascaderChange = (value: string[], selectedOptions: Option[]) => {
    const category: Category = JSON.parse(selectedOptions[0].value)
    this.setState({
      selectedUnit: category
    })
  }

  render(): React.ReactNode {
    const {getFieldDecorator} = this.props.form

    function filter(inputValue: string, path: Option[]) {
      return (path.some(option => (option.label).toLowerCase().indexOf(inputValue.toLowerCase()) > -1))
    }

    const prodCatOptions = this.mapCategoriesToOptions(this.props.productCategories)
    const unitCatOptions = this.mapCategoriesToOptions(this.props.unitCategories)

    const cascaderStyle = {width: 200, margin: 5}
    const rowStyle = {margin: 10, border: '#ccc solid 1px', borderRadius: 7, padding: '20px 20px 0px 20px'}
    const buttonStyle = {fontSize: '1em', paddingRight: 8, paddingLeft: 8, margin: 5}


    return <Form onSubmit={this.handleSubmit}>
      <div style={rowStyle}>
        <Row type="flex" justify="space-between">
          <div style={cascaderStyle}>
            <Cascader options={prodCatOptions}
                      key={"casc1"}
                      showSearch={{filter}}
                      onChange={this.handleProdCascaderChange}
                      placeholder={'Select product'}/>
          </div>
          {addFormItem({
            key: 'quantity',
            required: true,
            getFieldDecorator,
            type: 'number',
            placeholder: i18n('product.tableData.quantity'),
            errorMessage: 'This field is required'
          })}
          <div style={cascaderStyle}>
            <Cascader options={unitCatOptions}
                      showSearch={{filter}}
                      onChange={this.handleUnitCascaderChange}
                      placeholder={'Select unit'}/>
          </div>
          {addFormItem({
            key: 'itemPrice',
            required: true,
            getFieldDecorator,
            type: 'number',
            placeholder: i18n('product.tableData.itemPrice'),
            errorMessage: 'This field is required'
          })}
          <Tooltip placement="topLeft" title="Save item">
            <Button shape={'round'} style={buttonStyle} type={"primary"} htmlType={"submit"}><Icon
              type="save"/></Button>
          </Tooltip>
          <Tooltip placement="topLeft" title="Cancel">
            <Button shape={'round'} style={buttonStyle} type={"danger"} onClick={this.props.onCancel}><Icon
              type="rollback"/></Button>
          </Tooltip>
        </Row>
      </div>
    </Form>
  }
}

export default Form.create()(CreateProduct);
