import React from "react";
import {Card, Dropdown, Icon, message, Popconfirm, Menu, Row} from "antd";
import {post} from "../../libs/utils/request";
import {user} from "../../libs/utils/user";
import {openNotification} from "../../libs/utils/notification";
import CostForm from "../forms/CostForm";

type props = {
  cost: Cost
  onSuccess: () => void
}
type state = {
  isEditing: boolean
}

interface Cost {
  id: number
  name: string
  cost: number
  payedLastDate: Date
  type: string
}

const RED = '#f5222d'
const GREEN = '#52c41a'

class CostCard extends React.Component<props, state> {
  state = {
    isEditing: false
  }

  handleCostPaid = async (id: number) => {
    await post('mark-cost-as-paid', {id: id, email: user().email})
      .then((response: {success: boolean, message: string}) => {
        if (response.success) openNotification("success", "Cost paid!", response.message)
        else message.error(response.message)
        this.props.onSuccess()
      })
      .catch(err => {
        message.error(err)
      })
  }

  setIsEditing = (isEditing: boolean, isSuccess?: boolean) => {
    this.setState({
      isEditing: isEditing
    })
    if (isSuccess) this.props.onSuccess()
  }


  getBorderColor = (): String => {
    if (this.props.cost.payedLastDate === null) return RED
    let currentDate = new Date()
    let paidLastDate = new Date(this.props.cost.payedLastDate)
    let costType = this.props.cost.type
    let differenceInDays = currentDate.getDate() - paidLastDate.getDate()
    if (costType === 'MONTHLY' && differenceInDays >= 30) {
      return RED
    } else if (costType === 'WEEKLY' && differenceInDays >= 7) {
      return RED
    } else if (costType === 'ANNUAL' && differenceInDays >= 365) {
      return RED
    }
    return GREEN
  }

  render() {
    const {cost} = this.props

    const cellStyle = {margin: 5, padding: 5, border: '1px solid #f5222d', borderRadius: 5, backgroundColor: "#E7E9ED"}
    const borderColor = this.getBorderColor()

    const options = (
      <Menu>
        <Menu.Item key="1" onClick={() => this.setIsEditing(true)}><Icon type="edit" />Edit</Menu.Item>
        <Menu.Item key="2"><Icon type="delete" />Delete</Menu.Item>
      </Menu>
    )

    const costCard = !this.state.isEditing ? (
      <Card actions={[<div onClick={() => this.handleCostPaid(cost.id)}>
        <Icon type="barcode"/> Mark as paid</div>, <div onClick={()=>this.setIsEditing(true)}><Dropdown overlay={options}><Icon type="ellipsis" /></Dropdown></div>,]}
            style={{
              border: '1px solid #f5222d',
              minWidth: 250,
              maxWidth: 250,
              minHeight: 250,
              margin: 5,
              backgroundColor: "rgb(255, 206, 86, 0.5)"
            }}>
        <Row type={"flex"} justify={"space-around"}>
          <div style={{
            width: '100%',
            borderBottom: '1px solid #f5222d',
            fontWeight: 'bold',
          }}>
            {cost.name}
          </div>
        </Row>
        <Row>
          <div style={cellStyle}><Icon type="retweet"/>{cost.type}</div>
        </Row>
        <Row>
          <div style={cellStyle}>
            <Icon type="dollar"/> {cost.cost.toLocaleString()} HUF
          </div>
        </Row>
        <div style={cellStyle}>
          <Row>
            <div>Payed last at:</div>
          </Row>
          <Row>
            <div><Icon
              type="calendar"/> {cost.payedLastDate ? new Date(cost.payedLastDate).toLocaleDateString() : 'Isn\'t payed yet.'}
            </div>
          </Row>
        </div>
      </Card> ) : <CostForm  cost={cost} onSuccess={() => this.setIsEditing(false, true)} onCancel={() => this.setIsEditing(false)}/>
    return <div style={{margin: 10, opacity: borderColor === RED? 1:0.4}}>
      {costCard}
    </div>
  }
}

export default CostCard;
