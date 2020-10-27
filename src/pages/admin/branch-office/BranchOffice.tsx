import React, {Component} from 'react';
import {Button, Col, ConfigProvider, Empty, message, Row, Space, Table, Typography} from 'antd';
import {ColumnsType} from 'antd/lib/table';
import {DeleteOutlined, EditOutlined, PlusOutlined} from '@ant-design/icons';
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
        visibleNewModal: false
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
                        "address": order?.address?.first_address,
                        "city": order?.address?.city,
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

    deleteBranchOffice() {

    }

    componentDidMount() {
        this.getBranchOffices()
    }

    render() {
        const columns: ColumnsType<BranchOfficeTable> = [
            {
                title: 'ID',
                dataIndex: 'key',
                key: 'key',
            },
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                width: '30%',
            },
            {
                title: 'Email',
                dataIndex: 'email',
                key: 'email',
                width: '20%',
            },
            {
                title: 'Address',
                dataIndex: 'address',
                key: 'address',
            },
            {
                title: 'City',
                dataIndex: 'city',
                key: 'city',
            },
            {
                title: 'Actions',
                key: 'actions',
                render: () => (
                    <Space size="middle">
                        <Button shape="circle" icon={<EditOutlined/>} onClick={() => {
                            this.setState({visibleEditModal: true});
                        }}/>
                        <Button shape="circle" danger icon={<DeleteOutlined/>}/>
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
                        initialValues={{
                            id: "",
                            name: "Sucursal N",
                            email: "asd@asd.com",
                            first_address: "Chicago y N12",
                            second_address: "San Jose de Moran",
                            country: "Ecuador",
                            state: "Pichincha",
                            city: "Quito",
                            latitude: "-1.211454",
                            longitude: "-1.521656",
                        }}
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
