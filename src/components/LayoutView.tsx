import React, { Component } from 'react';
import { Layout } from 'antd';
import  HeaderView  from './layout-items/HeaderView';
import  ContentView  from './layout-items/ContentView';
import  FooterView  from './layout-items/FooterView';


class LayoutView extends Component {
    render() {
        return <Layout>
            <HeaderView/>
            <ContentView/>
            <FooterView/>
        </Layout>
    }
}
export default LayoutView;