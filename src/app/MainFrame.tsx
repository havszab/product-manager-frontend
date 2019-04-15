import * as React from "react"
import {Layout, Menu,  Row, Icon, Button} from 'antd'
import eventbus from "./libs/eventbus"
import {Redirect} from "react-router"
import {Link} from "react-router-dom"
import i18n from "./libs/i18n"
import LanguageSelector from "./components/LanguageSelector";
import {user} from "./libs/utils/user";

const {Content, Footer, Sider} = Layout;

interface MainFrameProps extends React.Props<any> {
}

export default class MainFrame extends React.Component<MainFrameProps, { redirect: boolean, currentPage: string, collapsed: boolean }> {

    constructor(props: MainFrameProps) {
        super(props);

        const location = window.location.pathname.substring(1, window.location.pathname.length);

        this.state = {
            redirect: false,
            currentPage: location,
            collapsed: true
        };

        eventbus.addListener(eventbus.events.logout, 'MainFrame', () => {
            this.setState({
                redirect: true
            })
        })
    }

    toggleCollapsed = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    logoutHandler = () => {
        this.setState({
            redirect: true
        });
        localStorage.removeItem('user')
    };

    render() {

        const location = window.location.pathname.substring(1, window.location.pathname.length);
        if (this.state.currentPage !== location) {
            this.setState({
                currentPage: location
            })
        }

        if (this.state.redirect) {
            return <Redirect to="/login"/>
        }

        const marginLeft = this.state.collapsed ? 80 : 200;
        const menuIconStyle = { fontSize: '32px' };
        const menuItemStyle = { marginBottom: '15px' };

        const userEmail = user() ? <div>{user().email}</div> : null


        return (
            <Layout className="layout">

                <Sider
                    trigger={null}
                    collapsible
                       collapsed={this.state.collapsed}
                       style={{width: marginLeft, transition: '0.5s', overflow: 'auto', height: '100vh', position: 'fixed', left: 0, background: '#fff' }}>
                    <Menu
                        mode="inline"
                        inlineCollapsed={this.state.collapsed}
                        inlineIndent={5}
                        defaultSelectedKeys={['menuItem#1']}
                        selectedKeys={[this.state.currentPage]}
                        style={{height: '100%', borderRight: 0, paddingTop: 32, paddingLeft: 8}}
                    >
                        <Menu.ItemGroup title={i18n('menuItems.menu')}>
                            <Menu.Item key={1} style={menuItemStyle}>
                                <Link to="/acquisition">
                                    <Icon type={'shopping-cart'} style={menuIconStyle}/><span>{i18n('menuItems.acquisition')}</span>
                                </Link>
                            </Menu.Item>

                            <Menu.Item key={2} style={menuItemStyle}>
                                <Link to="/stock">
                                    <Icon type={'home'} style={menuIconStyle}/><span>{i18n('menuItems.store')}</span>
                                </Link>
                            </Menu.Item>

                            <Menu.Item key={3} style={menuItemStyle}>
                                <Link to="/sales">
                                    <Icon type={'dollar'} style={menuIconStyle}/><span>{i18n('menuItems.sales')}</span>
                                </Link>
                            </Menu.Item>

                            <Menu.Item key={4} style={menuItemStyle}>
                                <Link to="/dashboard">
                                    <Icon type={'area-chart'} style={menuIconStyle}/><span>{i18n('menuItems.dashboard')}</span>
                                </Link>
                            </Menu.Item>

                            <Menu.Item key={5} style={{ marginBottom: '8px' }}>
                                <Link to="/carriers">
                                    <Icon type={'team'} style={menuIconStyle}/><span>{i18n('menuItems.employees')} & admin</span>
                                </Link>
                            </Menu.Item>


                            <Menu.Item key={6} style={{ marginTop: '15px', borderTop: '1px solid #ccc'}}>
                                <Link to="/login" onClick={this.logoutHandler}>
                                    <Icon type={'export'} style={menuIconStyle}/><span>{i18n('menuItems.logout')}</span>
                                </Link>
                            </Menu.Item>

                        </Menu.ItemGroup>
                    </Menu>
                </Sider>
                <Layout style={{padding: '0 24px 24px', marginLeft: marginLeft, transition: '0.5s'}}>
                    <Row type="flex" justify="space-between" style={{margin: 20}}>
                        <Button type="primary" onClick={this.toggleCollapsed} style={{marginTop: 16, marginBottom: 5}}>
                            <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}/>
                        </Button>
                        {userEmail}
                        <LanguageSelector/>
                    </Row>

                    <Content >
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
