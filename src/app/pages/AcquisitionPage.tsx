import * as React from "react"
import {Table} from 'antd'
import {get} from "../libs/utils/request"
import i18n from "../libs/i18n"

interface Props extends React.Props<any> {

}

type State = {}

export default class AcquisitionPage extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)
    }

    state = {
        dashboard: [{}],
        campaigns: [{}]
    }

    componentDidMount(): void {
        const user = JSON.parse(localStorage.getItem('user'))
        get("")
            .then(response => {
                this.setState({
                    dashboard: response
                })
            })

    }

    render() {
        const dashboardColumns = [
            {
                title: i18n('product.tableData.product'),
                dataIndex: '_id',
            },
            {
                title: i18n('product.tableData.quantity'),
                dataIndex: 'name',
            },
            {
                title: i18n('product.tableData.unit'),
                dataIndex: '',
            },
            {
                title: i18n('product.tableData.unitPrice'),
                dataIndex: 'pages[0].widgets.length',
            },
            {
                title: i18n('product.tableData.itemPrice')
            },
            {
                title: i18n('product.tableData.status')
            }

        ]
        const dashboard = this.state.dashboard;


        return (
        <div>
            <div>{i18n('product.currentAcquisition')}</div>
            <Table dataSource={dashboard} columns={dashboardColumns} pagination={false}/>
        </div>)

    }
}