import React, {Component} from 'react';
import {Image, Layout, Menu} from 'antd';
import {AppstoreOutlined, IdcardOutlined, NotificationOutlined, ShopOutlined} from '@ant-design/icons';
import {BrowserRouter as Router, Link, Switch} from "react-router-dom";
import {PrivateRoute} from '../redux/_components/PrivateRoute';
import {setLocale} from 'yup';

// Views
import HeaderView from './layout-items/HeaderView';
import FooterView from './layout-items/FooterView';
import Users from '../pages/admin/users/Users';
import BranchOffice from '../pages/admin/branch-office/BranchOffice';
import Newness from '../pages/admin/newness/Newness';
import './LayoutView.css';
import Products from "../pages/admin/products/Products";

const {Sider, Content} = Layout;

class LayoutView extends Component {
    render() {
        return <Layout>
            <Router>
                <Sider breakpoint="lg" collapsedWidth="0"
                       onBreakpoint={(broken: any) => {
                           //console.log(broken);
                       }}
                       onCollapse={(collapsed: any, type: any) => {
                           //console.log(collapsed, type);
                       }}>

                    <div style={{height: "10%", margin: "16px"}}>
                        <Image width={"100%"} src={require("../assets/logos/logo-largo.png")}/>
                    </div>
                    <Menu theme="dark" mode="inline">
                        {routes?.map((routeData, index) => {
                            return (
                                <Menu.Item key={index} icon={routeData.icon}><Link
                                    to={routeData.path}>{routeData.name}</Link></Menu.Item>
                            )
                        })}
                    </Menu>
                </Sider>
                <Layout>
                    <HeaderView/>
                    <Content style={{margin: "24px 16px 0"}}>
                        <div style={{padding: 24, minHeight: 500}}>
                            <Switch>
                                {routes.map((route, index) => (
                                    <PrivateRoute key={index} path={route.path} exact={route.exact}
                                                  children={<route.main/>}/>
                                ))}
                            </Switch>
                        </div>
                    </Content>
                    <FooterView/>
                </Layout>
            </Router>
        </Layout>
    }
}

export default LayoutView;


const routes = [
    {
        path: "/administrator/users",
        exact: true,
        name: "Usuarios",
        icon: <IdcardOutlined/>,
        main: () => <Users/>
    },
    {
        path: "/administrator/newness",
        name: "Novedades",
        icon: <NotificationOutlined/>,
        main: () => <Newness/>
    },
    {
        path: "/administrator/branch-offices",
        name: "Sucursales",
        icon: <ShopOutlined />,
        main: () => <BranchOffice/>
    },
    {
        path: "/administrator/products",
        name: "Productos",
        icon: <AppstoreOutlined/>,
        main: () => <Products/>
    }
];

setLocale({
    mixed: {
        required: "El campo es requerido"
    },
    string: {
        // eslint-disable-next-line no-template-curly-in-string
        min: "Mínimo ${min} caracteres",
        // eslint-disable-next-line no-template-curly-in-string
        max: "Máximo ${max} caracteres",
        email: "Ingrese un email válido"
    }
});
