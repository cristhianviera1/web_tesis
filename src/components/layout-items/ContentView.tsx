import React, { Component } from 'react';
import { Layout } from 'antd';
import Users from '../../pages/admin/users/Users';
import '../LayoutView.css';

const { Content } = Layout;

class ContentView extends Component {
    render() {
        return <Content style={{ margin: '24px 16px 0' }}>
        <div className="site-layout-background" style={{ padding: 24, minHeight: 500 }}>
              <Users/>
        </div>
      </Content>
    }
}

export default ContentView;