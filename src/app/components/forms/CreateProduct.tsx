import * as React from "react";
import {Form, Button, Row, Cascader, message} from 'antd'
import {WrappedFormUtils} from "antd/lib/form/Form";
import addFormItem from "../../libs/forms/addFormItem";
import i18n from "../../libs/i18n";
import {post} from "../../libs/utils/request";
import {user} from "../../libs/utils/user";


interface CreateProductProps extends React.Props<any> {
  form: WrappedFormUtils
  productCategories?: Array<Category>
  unitCategories?: Array<Category>
  onSuccess?: () => void
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
}

interface State {
  selectedProd?: Category
  selectedUnit?: Category
}

class CreateProduct extends React.Component<CreateProductProps, State> {
  constructor(props: CreateProductProps) {
    super(props)

    this.state = {
    }
  }

  async componentDidMount(): Promise<void> {
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
      let body : SaveRequestBody= values
      body.email = user().email
      body.name = this.state.selectedProd.productName
      body.unit = this.state.selectedUnit.unitName
      await post('save', body)
        .then(response => {
          message.success(response)
          this.props.onSuccess()
          this.props.form.resetFields()
        })
        .catch(e => {
          message.error(e)
        })
    })
  }


  handleProdCascaderChange = (value: string[], selectedOptions: Option[]) => {
    const category: Category= JSON.parse(selectedOptions[0].value)
    this.setState({
      selectedProd: category
    })
  }

  handleUnitCascaderChange = (value: string[], selectedOptions: Option[]) => {
    const category: Category= JSON.parse(selectedOptions[0].value)
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
    const simpleMargin = {margin: 5}
    const rowStyle = {margin: 10, border: '#ccc solid 1px', borderRadius: 7, padding: 10}

    return <Form onSubmit={this.handleSubmit}>
      <Row type="flex" justify="space-around" style={rowStyle}>
        <div style={cascaderStyle}>
          <Cascader options={prodCatOptions} showSearch={{filter}} onChange={this.handleProdCascaderChange} placeholder={'Select product'}/>
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
          <Cascader options={unitCatOptions} showSearch={{filter}} onChange={this.handleUnitCascaderChange} placeholder={'Select unit'}/>
        </div>
        {addFormItem({
          key: 'price',
          required: true,
          getFieldDecorator,
          type: 'number',
          placeholder: i18n('product.tableData.itemPrice'),
          errorMessage: 'This field is required'
        })}
        <Button style={simpleMargin} type={"primary"} htmlType={"submit"}>Save</Button>
        <Button style={simpleMargin} type={"danger"}>Cancel</Button>
      </Row>
    </Form>
  }
}

export default Form.create()(CreateProduct);