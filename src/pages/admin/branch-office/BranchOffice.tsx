import React, {Component} from 'react';
import {Button, Col, ConfigProvider, Empty, Input, message, Row, Space, Table, Typography} from 'antd';
import {ColumnsType} from 'antd/lib/table';
import {DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import {axiosConfig} from '../../../components/_helpers/axiosConfig';
import EditBranchModal from "../../../components/modals/branch_offices/edit";
import NewBranchModal from "../../../components/modals/branch_offices/new";

const {Title} = Typography;

const customizeRenderEmpty = () => (
    <div style={{textAlign: 'center'}}>
        <Empty description={<span>No se encontraron datos</span>}/>
    </div>
);

export interface BranchOfficeTable {
    id: string;
    key: number;
    name: string;
    email: string;
    address: string;
    city: string;
}

class BranchOffice extends Component {

    state = {
        branchOffices: [],
        searchText: '',
        searchedColumn: '',
        loading: false,
        visibleEditModal: false,
        visibleNewModal: false,
        idOffice:0,
    };

    getBranchOffices() {
        this.setState({loading: true});
        axiosConfig().get('branch-offices')
            .then(({data}) => {
                this.setState({
                    branchOffices: data?.map((order, index) => ({
                        "key": index + 1,
                        "id": order?._id,
                        "name": order?.name,
                        "email": order?.email,
                        "first_address": order?.address?.first_address,
                        "second_address": order?.address?.second_address,
                        "country": order?.address?.country,
                        "state": order?.address?.state,
                        "city": order?.address?.city,
                        "latitude": order?.address?.latitude,
                        "longitude": order?.address?.longitude,
                    }))
                });
            })
            .catch((error) => {
                if (error?.response?.data?.message) {
                    return message.error(error?.response?.data?.message);
                }
                return message.error("No se pudieron obtener las sucursales, por favor recargue la página")
            }).finally(() => this.setState({loading: false}));
    }

    deleteBranchOffice(branchOffice) {
        axiosConfig().delete(`branch-offices/${branchOffice.id}`).then(() => message.success("Se ha eliminado exitósamente la sucursal"))
            .catch((error) => {
            if (error?.response?.data?.message) {
                return message.error(error?.response?.data?.message);
            }
            return message.error("No se pudo eliminar la sucursal, por favor intentelo mas tarde")
        }).finally(()=> this.getBranchOffices())
    }

    componentDidMount() {
        this.getBranchOffices();
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

    render() {
        const columns: ColumnsType<BranchOfficeTable> = [
            {
                title: 'ID',
                dataIndex: 'key',
                key: 'key',
            },
            {
                title: 'Nombre',
                dataIndex: 'name',
                key: 'name',
                width: '30%',
                ...this.getColumnSearchProps('name')
            },
            {
                title: 'Email',
                dataIndex: 'email',
                key: 'email',
                width: '20%',
                ...this.getColumnSearchProps('email')
            },
            {
                title: 'Dirección',
                dataIndex: 'first_address',
                key: 'address',
                ...this.getColumnSearchProps('first_address')
            },
            {
                title: 'Ciudad',
                dataIndex: 'city',
                key: 'city',
                ...this.getColumnSearchProps('city')
            },
            {
                title: 'Acciones',
                dataIndex: 'key',
                key: 'actions',
                render: (key) => (
                    <Space size="middle">
                        <Button shape="circle" icon={<EditOutlined/>} onClick={() => {
                            this.setState({visibleEditModal: true, idOffice:key-1});
                        }}/>
                        <Button shape="circle" danger icon={<DeleteOutlined/>} onClick={() => {
                            this.setState({idOffice:key-1});
                            this.deleteBranchOffice(this.state.branchOffices[this.state.idOffice])
                        }}/>
                    </Space>)
            },
        ];

        return <div>
            <div>
                <Row gutter={{xs: 8, sm: 16, md: 24, lg: 32}}>
                    <Col className="gutter-row" span={20}>
                        <Title level={2}>Sucursales</Title>
                    </Col>
                    <Col className="gutter-row" span={4}>
                        <Button type="primary" icon={<PlusOutlined/>} onClick={() => {
                            this.setState({visibleNewModal: true})
                        }}>
                            Nuevo
                        </Button>
                        {
                            this.state.visibleNewModal &&
                            <NewBranchModal
                                visible={this.state.visibleNewModal}
                                initialValues={{
                                    name: "",
                                    email: "",
                                    first_address: "",
                                    second_address: "",
                                    country: "",
                                    state: "",
                                    city: "",
                                    latitude: "",
                                    longitude: "",
                                }}
                                onClose={() => {
                                    this.getBranchOffices();
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
                    dataSource={this.state.branchOffices}
                    scroll={{x: 'max-content'}}
                    loading={this.state.loading}
                />
                {
                    this.state.visibleEditModal &&
                    <EditBranchModal
                        visible={this.state.visibleEditModal}
                        initialValues={this.state.branchOffices[this.state.idOffice]}
                        onClose={() => {
                            this.getBranchOffices();
                            this.setState({visibleEditModal: false})
                        }}
                    />
                }
            </ConfigProvider>
        </div>
    }
}

export default BranchOffice;
