import React, {Component} from 'react';
import {Button, Card, Checkbox, Form, Input, message} from 'antd';
import logoCircular from '../assets/logos/logo-circular.png';
import {KeyOutlined, LoginOutlined, MailOutlined} from '@ant-design/icons';
import {history} from '../components/_helpers/history';
import {axiosConfig} from '../components/_helpers/axiosConfig';
import './Login.css';
import jwt_decode from "jwt-decode";
import {verifyRoleAndRedirect} from "../components/_helpers/checkRol";

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

    logIn(data) {
        axiosConfig().post('/auth/sign-in', data)
            .then(({data}) => {
                const decodedJWT: any = jwt_decode(data.accessToken);
                if (!verifyRoleAndRedirect(decodedJWT)) {
                    return message.warn("Tu usuario no se encuentra habilitado para usar el administrador web.")
                }
                localStorage.setItem('token', data.accessToken);
                localStorage.setItem('auth', 'true');
                history.push('/administrator');
                window.location.reload();
                message.success("Bienvenido")
            })
            .catch((error) => {
                if (error?.response?.data?.message) {
                    return message.error(error?.response?.data?.message);
                }
                return message.error("No se pudo iniciar sesión, por favor inténtelo mas tarde")
            })
    }

    componentWillMount() {
        if (localStorage.getItem('auth')) {
            history.push('/administrator');
            window.location.reload();
        }
    }

    onFinish = (values: any) => {
        this.logIn(values);
    };

    onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    render() {
        return <div className="App-content">
            <div className="App-login">
                <Card className={"App-card"}>
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
