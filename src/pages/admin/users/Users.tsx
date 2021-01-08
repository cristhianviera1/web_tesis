import React, {Component} from 'react';
import {axiosConfig} from '../../../components/_helpers/axiosConfig';
import {Avatar, Button, Col, Input, message, Modal, Row, Space, Table, Typography} from 'antd';
import {
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
    ManOutlined,
    PlusOutlined,
    SearchOutlined,
    UserOutlined,
    WomanOutlined
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import NewUsersModal from "../../../components/modals/users/new";
import EditUserModal from "../../../components/modals/users/edit";

const {Title, Text} = Typography;

export interface UsersTable {
    id: string;
    key: number;
    dni?: string;
    name: string;
    surname: string;
    gender: string;
    birthday?: string;
    password: string;
    email: string;
    status?: boolean;
    roles: string;
    image?: string;
}

interface colors {
    gender: string;
    label: string;
    icon: any
}

export const colorPeerGender: colors[] = [
    {
        gender: "man",
        label: "Hombre",
        icon: <ManOutlined/>
    },
    {
        gender: "woman",
        label: "Mujer",
        icon: <WomanOutlined/>
    },
    {
        gender: "other",
        label: "Otro",
        icon: <UserOutlined/>
    },
]

class Users extends Component {

    state = {
        users: [],
        searchText: '',
        searchedColumn: '',
        visibleEditModal: false,
        visibleNewModal: false,
        loading: false,
        idUser: 0,
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
                        "gender": order?.gender,
                        "birthday": order?.birthday,
                        "password": order?.password,
                        "phone": order?.phone,
                        "email": order?.email,
                        "status": order?.status,
                        "roles": order?.roles,
                        "image": order?.image,
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

    confirmDeleteModal(user) {
        return Modal.confirm({
            title: "Eliminar Usuario",
            icon: <ExclamationCircleOutlined/>,
            content: `¿Estás seguro que deseas eliminar al usuario: ${user.name} ${user.surname}?`,
            okText: "Aceptar",
            okType: "danger",
            onOk: () => this.deleteUser(user),
            visible: true,
            cancelText: "Cancelar"
        });
    };

    deleteUser(user) {
        axiosConfig().delete(`users/${user.id}`)
            .then(() => message.warn("Se ha eliminado exitósamente el usuario"))
            .catch((error) => {
                if (error?.response?.data?.message) {
                    return message.error(error?.response?.data?.message);
                }
                return message.error("No se pudo eliminar el usuario, por favor intentelo mas tarde")
            })
            .finally(() => this.getUsers())
    }

    // Filtro de busqueda
    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
            <div style={{padding: 8}}>
                <Input
                    ref={node => {
                        // @ts-ignore
                        this.searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{width: 188, marginBottom: 8, display: 'block'}}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined/>}
                        size="small"
                        style={{width: 90}}
                    >
                        Buscar
                    </Button>
                    <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{width: 90}}>
                        Restaurar
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{color: filtered ? '#1890ff' : undefined}}/>,
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
                    highlightStyle={{backgroundColor: '#ffc069', padding: 0}}
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
        this.setState({searchText: ''});
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
                dataIndex: 'image',
                key: 'image',
                render: (image) => (
                    <Avatar size={44} icon={<UserOutlined/>} src={image}/>
                )
            },
            {
                title: 'Nombre',
                dataIndex: 'name',
                key: 'name',
                render: (value, record) => (<Text>{`${record.name} ${record.surname}`}</Text>),
            },
            {
                title: 'Correo electrónico',
                dataIndex: 'email',
                key: 'email',
                ...this.getColumnSearchProps('email')
            },
            {
                title: 'Género',
                dataIndex: 'gender',
                key: 'gender',
                render: (value) => {
                    const foundGender = colorPeerGender.find((genders) => genders.gender === value);
                    return (
                        <Space style={{justifyContent: 'space-evenly'}}>
                            {foundGender.icon}
                            <Text>
                                {foundGender?.label}
                            </Text>
                        </Space>

                    );
                },
            },
            {
                title: 'Rol',
                dataIndex: 'roles',
                key: 'roles',
                ...this.getColumnSearchProps('roles')
            },
            {
                title: 'Estado',
                dataIndex: 'status',
                key: 'status',
                render: (key) =>
                    <Space style={{justifyContent: 'space-evenly'}}>
                        <div style={{
                            height: '10px', width: '10px', backgroundColor: key ? '#1F8110' : '#8C0406',
                            borderRadius: '50%',
                            display: 'inline-block'
                        }}/>
                        <Text>
                            {key ? "Activo" : "Inactivo"}
                        </Text>
                    </Space>
            },
            {
                title: 'Acciones',
                dataIndex: 'key',
                key: 'actions',
                render: (key, record) => (
                    <Space size="middle">
                        <Button shape="circle" icon={<EditOutlined/>} onClick={() => {
                            this.setState({visibleEditModal: true, idUser: key - 1});
                        }}/>
                        <Button shape="circle" danger icon={<DeleteOutlined/>} onClick={() => {
                            this.setState({idNews: key - 1});
                            this.confirmDeleteModal(record)
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
                                    name: "",
                                    surname: "",
                                    gender: "",
                                    birthday: 0,
                                    password: "",
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
        </div>
    }
}

export default Users;
