import React from "react";
import {Card, Icon, message, Row} from "antd";
import {post} from "../../libs/utils/request";
import {user} from "../../libs/utils/user";
import {openNotification} from "../../libs/utils/notification";

type props = {
  cost: Cost
  onSuccess: () => void
}
type state = {}

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
  state = {}

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

    return <div style={{border: `2px solid ${borderColor}`, margin: 10, opacity: borderColor === RED? 1:0.4}}>
      <Card actions={[<div onClick={() => this.handleCostPaid(cost.id)}>
        <Icon type="barcode"/> Mark as paid</div>, <div><Icon type="edit"/> Edit</div>]}
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
      </Card>
    </div>
  }
}

export default CostCard;
