import React, { Component } from 'react';
import { Layout, Menu } from 'antd';
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import  HeaderView  from './layout-items/HeaderView';
import  ContentView  from './layout-items/ContentView';
import  FooterView  from './layout-items/FooterView';
import './LayoutView.css';

const { Sider } = Layout;

class LayoutView extends Component {
    render() {
        return <Layout>
            <Sider 
                breakpoint="lg"
                collapsedWidth="0"
                onBreakpoint={(broken: any) => {
                    console.log(broken);
                }}
                onCollapse={(collapsed: any, type: any) => {
                    console.log(collapsed, type);
                }}>
           
            <div className="logo">
                <img src="../assets/logos/logo-circular.png" alt=""/> 
            </div>
            <img src="../assets/logos/logo-circular.png" alt=""/> 
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
                <Menu.Item key="1" icon={<UserOutlined />}>
                nav 1
                </Menu.Item>
                <Menu.Item key="2" icon={<VideoCameraOutlined />}>
                nav 2
                </Menu.Item>
                <Menu.Item key="3" icon={<UploadOutlined />}>
                nav 3
                </Menu.Item>
                <Menu.Item key="4" icon={<UserOutlined />}>
                nav 4
                </Menu.Item>
            </Menu>
            </Sider>
            <Layout>
                <HeaderView/>
                <ContentView/>
                <FooterView/>
            </Layout>
        </Layout>
    }
}
export default LayoutView;