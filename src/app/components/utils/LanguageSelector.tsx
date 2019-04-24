import * as React from "react"
import {Radio} from 'antd'
import { setLanguage } from "../../libs/i18n";
import {RadioChangeEvent} from "antd/lib/radio";

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

interface Props extends React.Props<any> {

}

type State = {}

export default class LanguageSelector extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)
    }

    onChange = (e:RadioChangeEvent) => {
        setLanguage(e.target.value)
    }

    render() {

        return (
            <div>
                <RadioGroup onChange={this.onChange} defaultValue={'en'}>
                    <RadioButton value={'hu'}>HU</RadioButton>
                    <RadioButton value={'en'}>EN</RadioButton>
                </RadioGroup>
            </div>)

    }
}
