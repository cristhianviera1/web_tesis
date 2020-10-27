import React, {Component} from 'react';
import {Avatar, Dropdown, Layout, Menu, PageHeader} from 'antd';
import {LogoutOutlined, UserOutlined} from '@ant-design/icons';
import {userActions} from '../../redux/_actions/user-actions';
import '../LayoutView.css';

const {Header} = Layout;

class HeaderView extends Component {

    logout = () => {
        userActions.logout();
    }

    menu = (
        <Menu>
            <Menu.Item danger onClick={(event) => {
                this.logout()
            }}><p>Cerrar sessión <LogoutOutlined/></p></Menu.Item>
        </Menu>
    );

    render() {
        return <Header className="site-layout-sub-header-background" style={{padding: 0}}>
            <PageHeader
                title=""
                extra={[
                    <Dropdown key="1" overlay={this.menu}>
                        <a className="ant-dropdown-link" href="/*" onClick={e => e.preventDefault()}>
                            <Avatar size="large" icon={<UserOutlined/>}/>
                        </a>
                    </Dropdown>,
                ]}
            >
            </PageHeader>
        </Header>
    }
}

export default HeaderView;
