import React, {CSSProperties} from "react"
import {Cascader} from 'antd'
import {CascaderOptionType} from 'antd/lib/cascader'
import i18n from '../../libs/i18n'

type props = {
  onChoose: (key: number) => void
  style?: CSSProperties
}
type state = {
  taxKeys: Array<CascaderOptionType>
}

class TaxKeyCascader extends React.Component<props, state> {
  state = {
    taxKeys: Array<CascaderOptionType>()
  }

  componentDidMount(): void {
    let keys = Array<CascaderOptionType>()
    keys.push({
      label: '27%',
      value: '27'
    })
    keys.push({
      label: '18%',
      value: '18'
    })
    keys.push({
      label: '5%',
      value: '5'
    })
    keys.push({
      label: '-',
      value: '0'
    })
    this.setState({
      taxKeys: keys
    })
  }

  onChangeHandler =  (value: string[], selectedOptions: CascaderOptionType[]) => {
    const key: number = parseInt(selectedOptions[0].value)
    this.props.onChoose(key)
  }

  render() {
    return (
      <div>
        <Cascader options={this.state.taxKeys}
                  onChange={this.onChangeHandler}
                  style={this.props.style}
        placeholder={i18n('invoice.taxKey')}/>
      </div>
    )
  }

}

export default TaxKeyCascader
