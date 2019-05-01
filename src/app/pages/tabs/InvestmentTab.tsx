import React from "react";
import InvestmentCard from "../../components/cards/InvestmentCard";
import {message, Row, Button, Icon, Modal, Tooltip} from "antd";
import {get} from "../../libs/utils/request";
import {user} from "../../libs/utils/user";
import InvestmentForm from "../../components/forms/InvestmentForm";
import AddButton from "../../libs/utils/AddButton";

type props = {}
type state = {
  investments: Array<Investment>
  isModalVisible: boolean
}

interface Investment {
  id: number
  title: string
  value: number
  description: string
  acquisitionDate: Date
}

class InvestmentTab extends React.Component<props, state> {
  state = {
    investments: Array<Investment>(),
    isModalVisible: false,
  }

  componentDidMount(): void {
    this.fetchAll()
  }

  fetchAll = () => {
    this.fetchInvestments()
  }

  isModalVisibleSwitchHandler = (isVisible: boolean, reFetch?: boolean) => {
    this.setState({
      isModalVisible: isVisible
    })
    if (reFetch) this.fetchAll()
  }

  fetchInvestments = async () => {
    await get('get-all-investments', {email: user().email})
      .then((response: { success: boolean, investments: Array<Investment>, message: string }) => {
        if (response.success) this.setState({investments: response.investments})
        else message.error(response.message)
      })
      .catch(err => {
        message.error(err)
      })
  }

  renderInvestments = (): React.ReactNode => {
    let invCards = []
    if (this.state.investments) {
      for (let inv of this.state.investments) {
        invCards.push(<InvestmentCard investment={inv} onSuccess={() => this.isModalVisibleSwitchHandler(false, true)} key={inv.id}/>)
      }
    }
    return invCards;
  }

  render() {

    const modalForm =
      <Modal visible={this.state.isModalVisible}
             closable={false}
             footer={null}
             centered={true}
             onCancel={() => this.isModalVisibleSwitchHandler(false)}
             style={{maxWidth: 560}}>
        <Row type={"flex"} justify={"space-around"}>
          <InvestmentForm
            onSuccess={() => this.isModalVisibleSwitchHandler(false, true)}
            onCancel={() => this.isModalVisibleSwitchHandler(false)}
          />
        </Row>
      </Modal>

    return (
      <div>
        {modalForm}
        <AddButton tooltip={'New investment'} onClick={() => this.isModalVisibleSwitchHandler(true)}/>

        <Row type={"flex"} justify={"space-around"}>
          {this.renderInvestments()}
        </Row>
      </div>
    )
  }

}

export default InvestmentTab;
