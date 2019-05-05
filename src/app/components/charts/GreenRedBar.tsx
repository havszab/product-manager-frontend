import React from "react";

type props = {
  income: number
  productCosts: number
  accountingCosts: number

}
type state = {
  incomePercent: number
  grossProfitPercent: number
  productCostsPercent: number
  accCostsPercent: number
  accProfitPercent: number
}

class GreenRedBar extends React.Component<props, state> {
  state = {
    incomePercent: 0,
    grossProfitPercent: 0,
    productCostsPercent: 0,
    accCostsPercent: 0,
    accProfitPercent: 0
  }

  componentDidMount(): void {
    this.getPercents()
  }

  getPercents = async () => {
    console.log(this.props)
    const max = Math.max(this.props.income, this.props.productCosts, this.props.accountingCosts)
    await this.setState({
      incomePercent: this.getPercent(this.props.income, max),
      productCostsPercent: this.getPercent(this.props.productCosts, max),
      accCostsPercent: this.getPercent(this.props.accountingCosts, max),
    })
    let prState  = {...this.state}
    await this.setState({
      grossProfitPercent: prState.incomePercent - prState.productCostsPercent,
      accProfitPercent: prState.incomePercent - prState.accCostsPercent
    })
    console.log(this.state)
  }

  getPercent = (a: number, b: number): number => {
    return a / b * 100
  }

  render() {
    return (
      <div>
        {this.state.incomePercent}
      </div>
    )
  }

}

export default GreenRedBar;
