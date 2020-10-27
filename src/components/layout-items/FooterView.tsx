import React, {Component} from 'react';
import {Layout} from 'antd';
import '../LayoutView.css';

const {Footer} = Layout;

class FooterView extends Component {
    render() {
        return <Footer style={{textAlign: 'center'}}>
            Kimirina ©2020 Created by Los duros del software
        </Footer>
    }
}

export default FooterView;
