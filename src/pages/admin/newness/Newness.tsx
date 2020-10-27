import React, {Component} from 'react';
import {Button, Col, ConfigProvider, Empty, message, Row, Space, Table, Typography, Image} from 'antd';
import {ColumnsType} from 'antd/lib/table';
import {DeleteOutlined, EditOutlined, PlusOutlined} from '@ant-design/icons';
import {axiosConfig} from '../../../components/_helpers/axiosConfig';
import NewNewnessModal from "../../../components/modals/newness/new";
import EditNewnessModal from "../../../components/modals/newness/edit";

const {Title} = Typography;

const customizeRenderEmpty = () => (
    <div style={{textAlign: 'center'}}>
        <Empty description={<span>No se encontraron datos</span>}/>
    </div>
);

export interface NewnessTable {
    id: string;
    key: number;
    title: string;
    description: string;
    image: string;
}

class Newness extends Component {

    state = {
        newness: [],
        searchText: '',
        searchedColumn: '',
        loading: false,
        visibleEditModal: false,
        visibleNewModal: false,
        idNews:0,
    };

    getNewness() {
        this.setState({loading: true});
        axiosConfig().get('newness')
            .then(({data}) => {
                this.setState({
                    newness: data?.map((order, index) => ({
                        "key": index + 1,
                        "id": order?._id,
                        "title": order?.title,
                        "description": order?.description,
                        "image": order?.image,
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

    deleteNewness() {

    }

    componentDidMount() {
        this.getNewness()
    }

    render() {
        const columns: ColumnsType<NewnessTable> = [
            {
                title: 'ID',
                dataIndex: 'key',
                key: 'key',
            },
            {
                title: 'Titulo',
                dataIndex: 'title',
                key: 'title',
            },
            {
                title: 'Descripción',
                dataIndex: 'description',
                key: 'description',
                width: '500px',
            },
            {
                title: 'Imagen',
                dataIndex: 'image',
                key: 'image',
                render:(image) => (
                    <Image
                        width={150}
                        height={150}
                        src={image}
                        fallback="data:image/png;base64,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"
                    />
                )
            },
            {
                title: 'Acciones',
                key: 'actions',
                render: (key) => (
                    <Space size="middle">
                        <Button shape="circle" icon={<EditOutlined/>} onClick={() => {
                            this.setState({visibleEditModal: true, idNews:key-1});
                        }}/>
                        <Button shape="circle" danger icon={<DeleteOutlined/>}/>
                    </Space>)
            },
        ];
        return <div>
            <div>
                <Row gutter={{xs: 8, sm: 16, md: 24, lg: 32}}>
                    <Col className="gutter-row" span={20}>
                        <Title level={2}>Novedades</Title>
                    </Col>
                    <Col className="gutter-row" span={4}>
                        <Button type="primary" icon={<PlusOutlined/>} onClick={() => {
                            this.setState({visibleNewModal: true})
                        }}>
                            Nuevo
                        </Button>
                        {
                            this.state.visibleNewModal &&
                            <NewNewnessModal
                                visible={this.state.visibleNewModal}
                                initialValues={{
                                    title: "",
                                    description: "",
                                    image: "",
                                }}
                                onClose={() => {
                                    this.getNewness();
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
                    dataSource={this.state.newness}
                    scroll={{x: 'max-content'}}
                    loading={this.state.loading}
                />
                {
                    this.state.visibleEditModal &&
                    <EditNewnessModal
                        visible={this.state.visibleEditModal}
                        initialValues={{
                            id: "",
                            title: "Sucursal N",
                            description: "asd@asd.com",
                            image: "Chicago y N12",
                        }}
                        onClose={() => {
                            this.getNewness();
                            this.setState({visibleEditModal: false})
                        }}
                    />
                }
            </ConfigProvider>
        </div>
    }
}

export default Newness;
