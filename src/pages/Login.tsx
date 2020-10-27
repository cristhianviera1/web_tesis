import React, {Component} from 'react';
import {Button, Card, Checkbox, Form, Input} from 'antd';
import logoCircular from '../assets/logos/logo-circular.png';
import {KeyOutlined, LoginOutlined, MailOutlined} from '@ant-design/icons';
import {history} from '../redux/_helpers/history';
import {userActions} from '../redux/_actions/user-actions';
import './Login.css';

const layout = {
    labelCol: {span: 8},
    wrapperCol: {span: 40},
};

const tailLayout = {
    wrapperCol: {offset: 0, span: 40},
};

class Login extends Component {

    constructor(props: any) {
        super(props);

        this.state = {
            email: '',
            password: ''
        }
    }

    componentWillMount() {
        if (localStorage.getItem('auth')) {
            history.push('/administrator');
            window.location.reload();
        }
    }

    onFinish = (values: any) => {
        console.log('Success:', values);
        userActions.login(values['email'], values['password']);
    };

    onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    render() {
        return <div className="App-content">
            <div className="App-login">
                <Card>
                    <img src={logoCircular} className="App-logo" alt="logo"/>
                    <h5>Te damos la bienvenida</h5>
                    <h6>Por favor inicia sessión</h6>

                    <Form {...layout} name="basic" className="Form-login" initialValues={{remember: true}}
                          onFinish={this.onFinish} onFinishFailed={this.onFinishFailed}>
                        <Form.Item name="email" rules={[{required: true, message: 'Por favor ingresa tu correo!'}]}>
                            <Input size="large" placeholder="Correo" prefix={<MailOutlined/>}/>
                        </Form.Item>

                        <Form.Item name="password"
                                   rules={[{required: true, message: 'Por favor ingresa tu contraseña!'}]}>
                            <Input.Password size="large" placeholder="Contraseña" prefix={<KeyOutlined/>}/>
                        </Form.Item>

                        <Form.Item {...tailLayout} name="remember" valuePropName="checked">
                            <Checkbox>Recuerdame</Checkbox>
                        </Form.Item>

                        <Form.Item {...tailLayout}>
                            <Button type="primary" block size="large" htmlType="submit" icon={<LoginOutlined/>}>
                                Ingresar
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </div>
    }
}

export default Login;
