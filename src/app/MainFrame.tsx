import * as React from "react"
import {Button, Layout, Col, Row, Form, Input, Icon, Checkbox, Menu, Breadcrumb} from 'antd'
import eventbus from "./libs/eventbus"
import {Redirect} from "react-router"
import {Link} from "react-router-dom"
import i18n from "./libs/i18n"


const {Content, Footer, Sider} = Layout

interface MainFrameProps extends React.Props<any> {
}

export default class MainFrame extends React.Component<MainFrameProps, { redirect: boolean, currentPage: string }> {

    constructor(props: MainFrameProps) {
        super(props)

        const location = window.location.pathname.substring(1, window.location.pathname.length)

        this.state = {
            redirect: false,
            currentPage: location
        }

        eventbus.addListener(eventbus.events.logout, 'MainFrame', () => {
            this.setState({
                redirect: true
            })
        })
    }

    logoutHandler = () => {
        this.setState({
            redirect: true
        })
        localStorage.removeItem('user')
    }

    render() {

        const location = window.location.pathname.substring(1, window.location.pathname.length)
        if (this.state.currentPage !== location) {
            this.setState({
                currentPage: location
            })
        }

        if (this.state.redirect) {
            return <Redirect to="/login"/>
        }

        return (
            <Layout className="layout">
                <Sider width={280} style={{
                    overflow: 'auto', height: '100vh', position: 'fixed', left: 0, background: '#fff'
                }}>
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['dummy']}
                        selectedKeys={[this.state.currentPage]}
                        style={{height: '100%', borderRight: 0, paddingTop: 32, paddingLeft: 8}}
                    >
                        <Menu.ItemGroup
                            title={i18n('menuItems.menu')}
                        >
                            <Menu.Item key="menuItem#1"><Link to="/acquisition">{i18n('menuItems.acquisition')}</Link></Menu.Item>
                            <Menu.Item key="menuItem#2"><Link to="/store">{i18n('menuItems.store')}</Link></Menu.Item>
                            <Menu.Item key="menuItem#3"><Link to="/dashboard/list">{i18n('menuItems.sales')}</Link></Menu.Item>
                            <Menu.Item key="menuItem#4"><Link to="/dashboard/list">{i18n('menuItems.dashboard')}</Link></Menu.Item>
                            <Menu.Item key="menuItem#5"><Link to="/dashboard/list">{i18n('menuItems.carriers')}</Link></Menu.Item>
                        </Menu.ItemGroup>
                    </Menu>
                </Sider>
                <Layout style={{padding: '0 24px 24px', marginLeft: 280}}>
                    <Breadcrumb style={{margin: '16px 0'}}>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item>{this.state.currentPage}</Breadcrumb.Item>
                    </Breadcrumb>
                    <Col span={3}>
                        <Button type="danger" onClick={this.logoutHandler}>Logout</Button>
                    </Col>
                    <Content style={{}}>
                        {this.props.children}
                    </Content>

                     <Footer className="footer">
            © 2019 HAVSZAB
          </Footer>
                </Layout>
            </Layout>
        )
    }
}