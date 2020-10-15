import React, { Component } from 'react';
import { Layout, PageHeader, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import '../LayoutView.css';

const { Header } = Layout;

class HeaderView extends Component {
    render() {
        return <Header className="site-layout-sub-header-background" style={{ padding: 0 }}>
                <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title="Title"
                extra={[
                    <Avatar key="1" size="large" icon={<UserOutlined />} />,
                ]}
                >
                </PageHeader>
            </Header>
    }
}

export default HeaderView;