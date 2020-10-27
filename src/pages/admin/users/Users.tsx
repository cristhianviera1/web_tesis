import React, {Component} from 'react';
import axios from 'axios';
import {ConfigProvider, Empty, Table} from 'antd';

const customizeRenderEmpty = () => (
    <div style={{textAlign: 'center'}}>
        <Empty description={<span>No se encontraron datos</span>}/>
    </div>
);

class Users extends Component {

    state = {
        users: [],
        searchText: '',
        searchedColumn: '',
    };

    async componentDidMount() {
        await axios.get('http://192.168.1.2:4000/user').then(response => {
            this.setState({users: response.data.data});
        }).catch(error => {
            console.log(error);
        });
    }


    render() {

        const columns = [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                width: '30%'
            },
            {
                title: 'Age',
                dataIndex: 'age',
                key: 'age',
                width: '20%'
            },
            {
                title: 'Gender',
                dataIndex: 'gender',
                key: 'gender'
            },
            {
                title: 'Rol',
                dataIndex: 'rol',
                key: 'rol'
            },
        ];

        return <ConfigProvider renderEmpty={customizeRenderEmpty}>
            <Table columns={columns} dataSource={this.state.users} rowKey="_id"/>
        </ConfigProvider>
    }
}

export default Users;
