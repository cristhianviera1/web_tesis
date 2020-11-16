import React, {Component} from 'react';
import {axiosConfig} from '../../../components/_helpers/axiosConfig';
import {Button, Col, ConfigProvider, Empty, Input, message, Row, Space, Table, Typography} from 'antd';
import {DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import NewUsersModal from "../../../components/modals/users/new";
import EditUserModal from "../../../components/modals/users/edit";
const {Title} = Typography;

const customizeRenderEmpty = () => (
    <div style={{textAlign: 'center'}}>
        <Empty description={<span>No se encontraron datos</span>}/>
    </div>
);

export interface UsersTable {
    id: string;
    key: number;
    dni?: string;
    name: string;
    surname: string;
    gender: string;
    birthday?: string;
    password: string;
    phone: number;
    email: string;
    status?: boolean;
    roles: string;

}

class Users extends Component {

    state = {
        users: [],
        searchText: '',
        searchedColumn: '',
        visibleEditModal: false,
        visibleNewModal: false,
        loading: false,
        idUser:0,
    };

    getUsers() {
        this.setState({loading: true});
        axiosConfig().get('users')
            .then(({data}) => {
                this.setState({
                    users: data?.map((order, index) => ({
                        "key": index + 1,
                        "id": order?._id,
                        "dni": order?.dni,
                        "name": order?.name,
                        "surname": order?.surname,
                        "gender":order?.gender,
                        "birthday": order?.birthday,
                        "password": order?.password,
                        "phone": order?.phone,
                        "email": order?.email,
                        "status": order?.status,
                        "roles": order?.roles,
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

    deleteUser(product) {
        axiosConfig().delete(`users/${product.id}`).then(() => message.success("Se ha eliminado exitósamente el usuario"))
            .catch((error) => {
                if (error?.response?.data?.message) {
                    return message.error(error?.response?.data?.message);
                }
                return message.error("No se pudo eliminar el usuario, por favor intentelo mas tarde")
            }).finally(()=> this.getUsers())
    }

    // Filtro de busqueda
    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        // @ts-ignore
                        this.searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Buscar
                    </Button>
                    <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Restaurar
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                // @ts-ignore
                setTimeout(() => this.searchInput.select(), 100);
            }
        },
        render: text =>
            this.state.searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[this.state.searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({
            searchText: selectedKeys[0],
            searchedColumn: dataIndex,
        });
    };

    handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
    };

    async componentDidMount() {
        this.getUsers()
    }


    render() {

        const columns = [
            {
                title: 'ID',
                dataIndex: 'key',
                key: 'key',
            },
            {
                title: 'Nombre',
                dataIndex: 'name',
                key: 'name',
                ...this.getColumnSearchProps('name')
            },
            {
                title: 'E-mail',
                dataIndex: 'email',
                key: 'email',
                ...this.getColumnSearchProps('email')
            },
            {
                title: 'Gender',
                dataIndex: 'gender',
                key: 'gender',
                ...this.getColumnSearchProps('gender')
            },
            {
                title: 'Rol',
                dataIndex: 'roles',
                key: 'roles',
                ...this.getColumnSearchProps('roles')
            },
            {
                title: 'Acciones',
                dataIndex: 'key',
                key: 'actions',
                render: (key) => (
                    <Space size="middle">
                        <Button shape="circle" icon={<EditOutlined/>} onClick={() => {
                            this.setState({visibleEditModal: true, idUser:key-1});
                        }}/>
                        <Button shape="circle" danger icon={<DeleteOutlined/>} onClick={() => {
                            this.setState({idNews:key-1});
                            this.deleteUser(this.state.users[this.state.idUser])
                        }}/>
                    </Space>)
            },
        ];

        return <div>
            <div>
                <Row gutter={{xs: 8, sm: 16, md: 24, lg: 32}}>
                    <Col className="gutter-row" span={20}>
                        <Title level={2}>Usuarios</Title>
                    </Col>
                    <Col className="gutter-row" span={4}>
                        <Button type="primary" icon={<PlusOutlined/>} onClick={() => {
                            this.setState({visibleNewModal: true})
                        }}>
                            Nuevo
                        </Button>
                        {
                            this.state.visibleNewModal &&
                            <NewUsersModal
                                visible={this.state.visibleNewModal}
                                initialValues={{
                                    dni: "",
                                    name: "",
                                    surname: "",
                                    gender: "",
                                    birthday: "",
                                    password: "",
                                    phone:0,
                                    email: "",
                                    status: true,
                                    roles: "",
                                    image: "",
                                }}
                                onClose={() => {
                                    this.getUsers();
                                    this.setState({visibleNewModal: false})
                                }}
                            />
                        }
                    </Col>
                </Row>
            </div>

            <ConfigProvider renderEmpty={customizeRenderEmpty}>
                <Table
                    columns={columns}
                    dataSource={this.state.users}
                    scroll={{x: 'max-content'}}
                    loading={this.state.loading}/>
                {
                    this.state.visibleEditModal &&
                    <EditUserModal
                        visible={this.state.visibleEditModal}
                        initialValues={this.state.users[this.state.idUser]}
                        onClose={() => {
                            this.getUsers();
                            this.setState({visibleEditModal: false})
                        }}
                    />
                }
            </ConfigProvider>
        </div>
    }
}

export default Users;
