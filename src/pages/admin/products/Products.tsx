import React, {Component} from 'react';
import {axiosConfig} from '../../../components/_helpers/axiosConfig';
import {Button, Col, ConfigProvider, Empty, Input, message, Row, Space, Table, Typography} from 'antd';
import {DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import NewProductsModal from "../../../components/modals/products/new";
import EditProductModal from "../../../components/modals/products/edit";

const {Title} = Typography;

const customizeRenderEmpty = () => (
    <div style={{textAlign: 'center'}}>
        <Empty description={<span>No se encontraron datos</span>}/>
    </div>
);

export interface ProductsTable {
    id: string;
    key: number;
    title: string;
    detail: string;
    price: string;
    category: string;
    stock: number;
    status?: boolean;
    image: string;
}

class Products extends Component {

    state = {
        products: [],
        searchText: '',
        searchedColumn: '',
        visibleEditModal: false,
        visibleNewModal: false,
        loading: false,
        idProduct:0,
    };

    getProducts() {
        this.setState({loading: true});
        axiosConfig().get('products')
            .then(({data}) => {
                this.setState({
                    products: data?.map((order, index) => ({
                        "key": index + 1,
                        "id": order?._id,
                        "title": order?.title,
                        "detail": order?.detail,
                        "price": order?.price,
                        "category": order?.category,
                        "stock": order?.stock,
                        "status": order?.status,
                        "image": order?.image,
                    }))
                });
            })
            .catch((error) => {
                if (error?.response?.data?.message) {
                    return message.error(error?.response?.data?.message);
                }
                return message.error("No se pudieron obtener los productos, por favor recargue la página")
            }).finally(() => this.setState({loading: false}));
    }

    deleteProduct(product) {
        axiosConfig().delete(`product/${product.id}`).then(() => message.success("Se ha eliminado exitósamente el producto"))
            .catch((error) => {
                if (error?.response?.data?.message) {
                    return message.error(error?.response?.data?.message);
                }
                return message.error("No se pudo eliminar el producto, por favor intentelo mas tarde")
            }).finally(()=> this.getProducts())
    }

    async componentDidMount() {
       this.getProducts();
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

        const columns = [
            {
                title: 'ID',
                dataIndex: 'key',
                key: 'key',
            },
            {
                title: 'Título',
                dataIndex: 'title',
                key: 'title',
                ...this.getColumnSearchProps('title')
            },
            {
                title: 'Stock',
                dataIndex: 'stock',
                key: 'stock',
                ...this.getColumnSearchProps('stock')
            },
            {
                title: 'Precio',
                dataIndex: 'price',
                key: 'price',
                ...this.getColumnSearchProps('price')
            },
            {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                ...this.getColumnSearchProps('status')
            },
            {
                title: 'Acciones',
                dataIndex: 'key',
                key: 'actions',
                render: (key) => (
                    <Space size="middle">
                        <Button shape="circle" icon={<EditOutlined/>} onClick={() => {
                            this.setState({visibleEditModal: true, idNews:key-1});
                        }}/>
                        <Button shape="circle" danger icon={<DeleteOutlined/>} onClick={() => {
                            this.setState({idNews:key-1});
                            this.deleteProduct(this.state.products[this.state.idProduct])
                        }}/>
                    </Space>)
            },
        ];

        return <div>
            <div>
                <Row gutter={{xs: 8, sm: 16, md: 24, lg: 32}}>
                    <Col className="gutter-row" span={20}>
                        <Title level={2}>Productos</Title>
                    </Col>
                    <Col className="gutter-row" span={4}>
                        <Button type="primary" icon={<PlusOutlined/>} onClick={() => {
                            this.setState({visibleNewModal: true})
                        }}>
                            Nuevo
                        </Button>
                        {
                            this.state.visibleNewModal &&
                            <NewProductsModal
                                visible={this.state.visibleNewModal}
                                initialValues={{
                                    title: "",
                                    detail: "",
                                    price: 0,
                                    category: "",
                                    stock: 0,
                                    status: true,
                                    image: "",
                                }}
                                onClose={() => {
                                    this.getProducts();
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
                    dataSource={this.state.products}
                    scroll={{x: 'max-content'}}
                    loading={this.state.loading}/>
                {
                    this.state.visibleEditModal &&
                    <EditProductModal
                        visible={this.state.visibleEditModal}
                        initialValues={this.state.products[this.state.idProduct]}
                        onClose={() => {
                            this.getProducts();
                            this.setState({visibleEditModal: false})
                        }}
                    />
                }
            </ConfigProvider>
        </div>
    }
}

export default Products;
