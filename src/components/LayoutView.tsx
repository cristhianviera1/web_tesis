import React, { Component } from 'react';
import { Layout, Menu, Image } from 'antd';
import { IdcardOutlined, NotificationOutlined, AppstoreOutlined } from '@ant-design/icons';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

// Views
import  HeaderView  from './layout-items/HeaderView';
import  FooterView  from './layout-items/FooterView';
import Users from '../pages/admin/users/Users';
import './LayoutView.css';

const { Sider, Content } = Layout;

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
            
                    <div style={{ height: "10%", margin: "16px" }}>
                        <Image width={"100%"} src={require("../assets/logos/logo-largo.png")}/>
                    </div>
                    <Menu theme="dark" mode="inline">
                        {routes?.map((routeData, index) => {
                            return (
                            <Menu.Item key={index} icon={routeData.icon}><Link to={routeData.path}>{routeData.name}</Link></Menu.Item>
                            )
                        })}
                    </Menu>
                </Sider>
                <Layout>
                    <HeaderView/>
                    <Content style={{ margin: "24px 16px 0" }}>
                        <div style={{ padding: 24, minHeight: 500 }}>
                            <Switch>
                                {routes.map((route, index) => (
                                <Route key={index} path={route.path} exact={route.exact} children={<route.main />}/>
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
      icon: <IdcardOutlined />,
      main: () => <Users/>
    },
    {
      path: "/administrator/news",
      name: "Noticias",
      icon: <NotificationOutlined />,
      main: () => <h2>Bubblegum</h2>
    },
    {
      path: "/administrator/products",
      name: "Productos",
      icon: <AppstoreOutlined />,
      main: () => <h2>Shoelaces</h2>
    }
];