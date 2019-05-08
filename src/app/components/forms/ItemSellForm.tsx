import * as React from "react";
import {Icon, Input, message, Slider} from 'antd'
import Row from "antd/lib/grid/row";
import {ChangeEvent} from "react";
import Button from "antd/lib/button";
import {user} from "../../libs/utils/user";
import {post} from "../../libs/utils/request";
import {openNotification} from "../../libs/utils/notification";


interface ItemSellProps extends React.Props <any> {
  product: Product
  onCancel: () => void
  onSubmit: () => void
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
}

interface ProductCategory {
  id: number
  productName: string
}

interface UnitCategory {
  id: number
  unitName: string
}

type state = {
  quantToSell: number
  valueToSell: number
  priceToSell: number
  profit: number
  profitPerUnit: number
  remainingInStock: number
  isLoading: boolean
}


class ItemSellForm extends React.Component<ItemSellProps, state> {
  constructor(props: ItemSellProps) {
    super(props)

    this.state = {
      quantToSell: 0,
      valueToSell: 0,
      priceToSell: 0,
      profit: 0,
      profitPerUnit: 0,
      remainingInStock: 0,
      isLoading: false
    }
  }

  sliderChangeHandler = (value:number) => {
    this.setState({
      quantToSell: value
    })
  }

  priceInputChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    let price : number = parseInt(event.target.value)
    this.setState({
      priceToSell: price
    })
  }

  productSellHandler = async () => {
    let requestBody = {
      prodToSell: this.props.product.id,
      quantToSell: this.state.quantToSell,
      value: this.props.product.unitPrice * this.state.quantToSell,
      income: !isNaN(this.state.priceToSell) ? this.state.priceToSell : 0,
      profit: (!isNaN(this.state.priceToSell - this.props.product.unitPrice * this.state.quantToSell) ?
        this.state.priceToSell - this.props.product.unitPrice * this.state.quantToSell : 0),
      email: user().email
    }
    this.setState({
      isLoading: true
    })
    await post('sell-item', requestBody)
      .then((res: {success: boolean, message: string  }) => {
        if (res.success) openNotification("success", "Item sold!", res.message)
        else message.error(res.message)
      }).catch(err => {
        message.error('Error occurred while selling product. Error description: ' + err)
      })
      .then(() => this.setState({
        isLoading: false
      }))
    this.props.onSubmit()
  }


  render() {
    const {product} = this.props

    const colStyle = {width: '50%'}
    const headerCol = {borderRight: '1px solid #ccc', width: '48%', marginRight: '2%'}
    const stockInfoStyle = {borderRadius: 7, border: '1px solid #ccc', margin: '10px 20px', padding: 5}
    const titleStyle = {borderBottom: '1px #ccc solid', backgroundColor: '#f5f5f5', borderTop: '1px solid #ccc', paddingTop: 12, margin: 5}

    const profit =  !isNaN(this.state.priceToSell - this.props.product.unitPrice * this.state.quantToSell) ?
      this.state.priceToSell - this.props.product.unitPrice * this.state.quantToSell : 0

    const fontColor = profit >  0 ? {width: '50%', color: '#52c41a'} : {width: '50%', color: '#f5222d'}

    const income = !isNaN(this.state.priceToSell) ?
      this.state.priceToSell : 0

    const sellBtn = this.state.isLoading
      ? <Button type={"primary"} style={{minWidth: '30%'}} disabled={true} onClick={this.productSellHandler}><Icon type="loading" /></Button>
      : <Button type={"primary"} style={{minWidth: '30%'}} onClick={this.productSellHandler}>Sell</Button>


    return (
      <div>
        <Row type={"flex"} justify={"space-around"} style={titleStyle}><h3>Selling {product.productCategory.productName}</h3></Row>
        <div style={stockInfoStyle}>
          <Row type={"flex"} justify={"space-between"}>
            <div style={headerCol}>Value</div>
            <div style={colStyle}>{product.itemPrice.toLocaleString()} HUF</div>
          </Row>
          <Row type={"flex"} justify={"space-between"}>
            <div style={headerCol}>Currently in stock</div>
            <div style={colStyle}>{product.quantity} {product.unitCategory.unitName}</div>
          </Row>
          <Row type={"flex"} justify={"space-between"}>
            <div style={headerCol}>Value per unit</div>
            <div style={colStyle}>{Math.floor(product.unitPrice)} HUF/{product.unitCategory.unitName}</div>
          </Row>
          <Row type={"flex"} justify={"space-between"}>
            <div style={headerCol}>Stock value</div>
            <div style={colStyle}>{product.itemPrice} HUF</div>
          </Row>
        </div>

        <Row type={"flex"} justify={"space-around"} style={titleStyle}><h3>Set quantity and price</h3></Row>


        <Row type={"flex"} justify={"space-around"}>
            <span style={{marginTop: 5}}>0</span>
            <Slider min={0}
                    max={product.quantity}
                    style={{width: '60%'}}
                    dots={product.quantity <= 5}
                    onChange={this.sliderChangeHandler}/>
            <span style={{marginTop: 5}}>{product.quantity}</span>
        </Row>

        <Row type={"flex"} justify={"space-around"}>
          <Input type={'number'} style={{width: '60%'}} min={0} onChange={this.priceInputChangeHandler} placeholder={'Price'}/>
        </Row>

        <Row type={"flex"} justify={"space-around"} style={titleStyle}><h3>Offered item's details</h3></Row>
        <div style={stockInfoStyle}>
          <Row type={"flex"} justify={"space-between"}>
            <div style={headerCol}>Quantity </div>
            <div style={colStyle}>{this.state.quantToSell} {this.props.product.unitCategory.unitName}</div>
          </Row>
          <Row type={"flex"} justify={"space-between"}>
            <div style={headerCol}>Value</div>
            <div style={colStyle}>{this.props.product.unitPrice * this.state.quantToSell} HUF</div>
          </Row>
          <Row type={"flex"} justify={"space-between"}>
            <div style={headerCol}>Income</div>
            <div style={colStyle}>{income.toLocaleString()} HUF</div>
          </Row>
          <Row type={"flex"} justify={"space-between"}>
            <div style={headerCol}>Profit</div>
            <div style={fontColor}>{profit.toLocaleString()} HUF</div>
          </Row>
        </div>
         <Row type={"flex"} justify={"space-around"}>
           <Button type={"danger"} onClick={this.props.onCancel} style={{minWidth: '30%'}}>Cancel</Button>
           {sellBtn}
         </Row>
      </div>

    )

  }
}

export default ItemSellForm;
