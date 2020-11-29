import React, {FunctionComponent, useEffect, useState} from 'react';
import {ConfigProvider, Image, Layout, Menu} from 'antd';
import {
    AppstoreOutlined,
    DollarCircleOutlined,
    IdcardOutlined,
    LogoutOutlined,
    NotificationOutlined,
    ShopOutlined
} from '@ant-design/icons';
import {BrowserRouter as Router, Link, Switch} from "react-router-dom";
import {PrivateRoute} from './_helpers/PrivateRoute';
import {setLocale} from 'yup';

// Views
import FooterView from './layout-items/FooterView';
import Users from '../pages/admin/users/Users';
import BranchOffice from '../pages/admin/branch-office/BranchOffice';
import Newness from '../pages/admin/newness/Newness';
import './LayoutView.css';
import Products from "../pages/admin/products/Products";
import {history} from "./_helpers/history";
import esES from "antd/lib/locale/es_ES";
import {allowedRolesEnum} from "./_helpers/checkRol";
import jwt_decode from "jwt-decode";

const {Sider, Content} = Layout;

const LayoutView: FunctionComponent = () => {
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const [user, setUser] = useState<allowedRolesEnum>();
    useEffect(() => {
        const token = localStorage.getItem('token');
        const decodedJWT: any = jwt_decode(token);
        setUser(decodedJWT.roles);
    }, [user])
    return (
        <Layout>
            <Router>
                <Sider
                    theme="light"
                    style={{
                        minHeight: "100vh",
                        boxShadow: "0 2px 21px rgba(0,37,136,0.23)",
                        position: "fixed",
                        zIndex: 99
                    }}
                    breakpoint="lg"
                    onBreakpoint={(breakPoint) => setCollapsed(breakPoint)}
                    collapsedWidth="0"
                >
                    <div
                        style={{
                            display: "flex",
                            width: "100%",
                            marginTop: '15px',
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <Image
                            width={100}
                            height={"auto"}
                            preview={false}
                            src={require("../assets/logos/logo-largo.png")}
                        />
                    </div>
                    <Menu theme="light" mode="inline">
                        {routes?.map((routeData, index) => {
                            console.log(user);
                            if (routeData.roles.includes(user)) {
                                return (
                                    <Menu.Item key={index} icon={routeData.icon}><Link
                                        to={routeData.path}>{routeData.name}</Link></Menu.Item>
                                );
                            }
                        })}
                        <Menu.Item key={routes.length + 1} icon={<LogoutOutlined/>} onClick={() => {
                            localStorage.removeItem('auth');
                            localStorage.removeItem('token');
                            history.push('/');
                            window.location.reload();
                        }}>Cerrar sesión
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout style={{
                    marginLeft: collapsed ? 0 : 200,
                    minHeight: "100vh",
                    padding: "3% 3% 0 3%"
                }}>
                    <ConfigProvider locale={esES}>
                        <Content>
                            <Switch>
                                {routes.map((route, index) => (
                                    <PrivateRoute key={index} path={route.path} exact={route.exact}
                                                  children={<route.main/>}/>
                                ))}
                            </Switch>
                        </Content>
                    </ConfigProvider>
                    <FooterView/>
                </Layout>
            </Router>
        </Layout>
    );
}

export default LayoutView;


const routes = [
    {
        path: "/administrator/users",
        exact: true,
        name: "Usuarios",
        icon: <IdcardOutlined/>,
        main: () => <Users/>,
        roles: [allowedRolesEnum.ADMIN]
    },
    {
        path: "/administrator/newness",
        name: "Novedades",
        icon: <NotificationOutlined/>,
        main: () => <Newness/>,
        roles: [allowedRolesEnum.ADMIN]
    },
    {
        path: "/administrator/branch-offices",
        name: "Sucursales",
        icon: <ShopOutlined/>,
        main: () => <BranchOffice/>,
        roles: [allowedRolesEnum.ADMIN]
    },
    {
        path: "/administrator/products",
        name: "Productos",
        icon: <AppstoreOutlined/>,
        main: () => <Products/>,
        roles: [allowedRolesEnum.ADMIN]
    },
    {
        path: "/administrator/products",
        name: "Pedidos",
        icon: <DollarCircleOutlined/>,
        main: () => <Products/>,
        roles: [allowedRolesEnum.ADMIN, allowedRolesEnum.BRANCH_ADMIN]
    }
];

setLocale({
    mixed: {
        required: "El campo es requerido"
    },
    string: {
        min: (min) => `Mínimo ${min} caracteres`,
        max: (max) => `Máximo ${max} caracteres`,
        email: "Ingrese un email válido"
    },
    number: {
        min: (min) => `Mínimo ${min} números`,
        max: (max) => `Máximo ${max} números`,
    }
});
