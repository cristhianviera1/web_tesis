import React, {Component} from 'react';
import {Layout} from 'antd';
import '../LayoutView.css';

const {Footer} = Layout;

class FooterView extends Component {
    render() {
        return <Footer style={{textAlign: 'center'}}>
            ©2020 Made with ❤ by Kitty Cat
        </Footer>
    }
}

export default FooterView;
