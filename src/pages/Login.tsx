import React, { Component } from 'react';
import { Form, Input, Button, Checkbox, Card } from 'antd';
import logoCircular from '../assets/logos/logo-circular.png';
import { MailOutlined, KeyOutlined, LoginOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './Login.css';

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 40 },
};

const tailLayout = {
    wrapperCol: { offset: 0, span: 40 },
};

class Login extends Component {

    onFinish = (values: any) => {
        console.log('Success:', values);
    };

    onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    render() {
        return <div className="App-content">
        <div className="App-login">
            <Card>
            <img src={logoCircular} className="App-logo" alt="logo" />
            <h5>Te damos la bienvenida</h5>
            <h6>Por favor inicia sessión</h6>

            <Form {...layout} name="basic" className="Form-login" initialValues={{ remember: true }} onFinish={this.onFinish} onFinishFailed={this.onFinishFailed}>
                <Form.Item name="email" rules={[{ required: true, message: 'Por favor ingresa tu correo!' }]}>
                    <Input size="large" placeholder="Correo" prefix={<MailOutlined />} />
                </Form.Item>

                <Form.Item name="password" rules={[{ required: true, message: 'Por favor ingresa tu contraseña!' }]}>
                    <Input.Password size="large" placeholder="Contraseña" prefix={<KeyOutlined />} />
                </Form.Item>

                <Form.Item {...tailLayout} name="remember" valuePropName="checked">
                    <Checkbox>Recuerdame</Checkbox>
                </Form.Item>

                <Form.Item {...tailLayout}>
                    <Link to="/administrator">
                        <Button type="primary" block size="large" htmlType="submit" icon={<LoginOutlined />}>
                        Ingresar
                        </Button>
                    </Link>
                </Form.Item>
            </Form>
            </Card>
        </div>
      </div>
    }
}

export default Login;