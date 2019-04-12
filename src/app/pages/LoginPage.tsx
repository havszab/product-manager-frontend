import * as React from "react"
import {Button, Layout, Col, Row, Form, Input, Icon, Checkbox} from 'antd'
import {WrappedFormUtils} from "antd/lib/form/Form"
import {post} from "../libs/utils/request"
import i18n from "../libs/i18n"
import TranslatedText from "../libs/i18n/TranslatedText"
import {Redirect} from "react-router"

const {Content, Footer} = Layout

interface LoginPageProps extends React.Props<any> {
    form: WrappedFormUtils
}

interface LoginPageState {
    loading: boolean
    redirect: boolean
    error?: string
}

class LoginPage extends React.Component<LoginPageProps, LoginPageState> {

    constructor(props: LoginPageProps) {
        super(props)

        this.state = {
            redirect: false,
            loading: false
        }
    }

    handleSubmit = (e: any) => {
        e.preventDefault()
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                this.setState({
                    loading: true
                })
                try {
                    const loginData = {
                        email: values.email,
                        password: values.password
                    }
                    const response = await post('auth/login', loginData)
                    let result = JSON.parse(JSON.stringify(loginData));
                    localStorage.setItem('user', JSON.stringify(result))
                    this.setState({
                        redirect: true
                    })
                } catch (error) {
                    let errorText
                    if (error && error.response && error.response.status === 401) {
                        errorText = i18n('login.error.badCredentials')
                    } else {
                        errorText = i18n('general.error.unknown')
                    }
                    this.setState({
                        loading: false,
                        error: errorText
                    })
                }
            }
        })
    }

    render() {
        const {getFieldDecorator} = this.props.form

        if (this.state.redirect) {
            return <Redirect to="/dashboard"/>
        }

        const errorMsg = this.state.error ? <Col>{this.state.error}</Col> : null

        return (
            <Layout className="layout">
                <Content style={{}}>
                    <Row type="flex" justify="space-around" style={{marginTop: 200}} className="">
                        <Col xs={8} sm={6} lg={4} style={{textAlign: 'center'}}>
                            {/*<img src='images/logo.png' style={{maxWidth: "60%", marginBottom: 48}}/>*/}
                            <Form onSubmit={this.handleSubmit} className="login-form">
                                <Form.Item>
                                    {getFieldDecorator('email', {
                                        rules: [{required: true, message: i18n('login.form.error.badEmailFormat')}],
                                    })(
                                        <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                               placeholder={i18n('login.form.email')}/>
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    {getFieldDecorator('password', {
                                        rules: [{required: true, message: i18n('login.form.error.emptyPassword')}],
                                    })(
                                        <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                               type="password" placeholder={i18n('login.form.password')}/>
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    <Row type="flex" justify="space-around">
                                        {errorMsg}
                                        <Col>
                                            <Button type="primary" htmlType="submit" className="login-form-button">
                                                <TranslatedText code="login.form.submit"/>
                                            </Button>
                                        </Col>
                                    </Row>

                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                </Content>
                <Footer className="footer">
                    © 2019 HAVSZAB
                 </Footer>
            </Layout>
        )
    }
}

export default Form.create()(LoginPage)
