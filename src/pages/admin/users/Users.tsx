import React, {Component} from 'react';
import axios from 'axios';
import {axiosConfig} from '../../../components/_helpers/axiosConfig';
import {ConfigProvider, Empty, message, Table} from 'antd';

const customizeRenderEmpty = () => (
    <div style={{textAlign: 'center'}}>
        <Empty description={<span>No se encontraron datos</span>}/>
    </div>
);

export interface UsersTable {
    id: string;
    key: number;
    dni: string;
    name: string;
    surname: string;
    password: string;
    phone: string;
    status?: boolean;
    roles: string;
    birthday?: string;
}

class Users extends Component {

    state = {
        users: [],
        searchText: '',
        searchedColumn: '',
    };

    getUsers() {
        this.setState({loading: true});
        axiosConfig().get('users')
            .then(({data}) => {
                this.setState({
                    newness: data?.map((order, index) => ({
                        "key": index + 1,
                        "id": order?._id,
                        "dni": order?.dni,
                        "name": order?.name,
                        "surname": order?.surname,
                        "password": order?.password,
                        "phone": order?.phone,
                        "status": order?.status,
                        "roles": order?.roles,
                        "birthday": order?.birthday,
                    }))
                });
            })
            .catch((error) => {
                if (error?.response?.data?.message) {
                    return message.error(error?.response?.data?.message);
                }
                return message.error("No se pudieron obtener los usuarios, por favor recargue la página")
            }).finally(() => this.setState({loading: false}));
    }

    async componentDidMount() {
        this.getUsers()
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
