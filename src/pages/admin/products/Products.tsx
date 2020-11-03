import React, {Component} from 'react';
import axios from 'axios';
import {axiosConfig} from '../../../components/_helpers/axiosConfig';
import {Button, ConfigProvider, Empty, message, Space, Table} from 'antd';
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";

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

    deleteProduct(id) {
        axiosConfig().delete(`product/${id}`).then(() => message.success("Se ha eliminado exitósamente el producto"))
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
                key: 'title'
            },
            {
                title: 'Stock',
                dataIndex: 'stock',
                key: 'stock'
            },
            {
                title: 'Precio',
                dataIndex: 'price',
                key: 'price'
            },
            {
                title: 'Status',
                dataIndex: 'status',
                key: 'status'
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
                            this.deleteProduct(this.state.idProduct)
                        }}/>
                    </Space>)
            },
        ];

        return <ConfigProvider renderEmpty={customizeRenderEmpty}>
            <Table
                columns={columns}
                dataSource={this.state.products}
                scroll={{x: 'max-content'}}
                loading={this.state.loading}/>
        </ConfigProvider>
    }
}

export default Products;
