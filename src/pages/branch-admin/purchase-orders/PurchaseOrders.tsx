import React, {Component} from 'react';
import {Button, Col, Input, message, Modal, Row, Space, Table, Typography} from 'antd';
import {ColumnsType} from 'antd/lib/table';
import {DeleteOutlined, EditOutlined, ExclamationCircleOutlined, SearchOutlined} from '@ant-design/icons';
import {axiosConfig} from '../../../components/_helpers/axiosConfig';
import EditPurchaseOrderModal from "../../../components/modals/purchase_orders/edit";
import Highlighter from "react-highlight-words";
import moment from "moment";
import {ProductsTable} from "../../../components/forms/purchase_orders/purchase-orders-form";

const {Title, Text} = Typography;

export interface PurchaseOrdersTable {
    _id: string;
    key: number;
    name: string;
    surname: string;
    products: ProductsTable[];
    status: string;
    voucher_status: string;
    voucher_image: string;
    total: string;
    created_at: string;
}

class PurchaseOrders extends Component {

    state = {
        purchaseOrders: [],
        searchText: '',
        searchedColumn: '',
        loading: false,
        visibleEditModal: false,
        visibleNewModal: false,
        idPurchaseOrder: 0,
    };

    getPurchaseOrders() {
        this.setState({loading: true});
        axiosConfig().get('shopping-carts')
            .then(({data}) => {
                this.setState({
                    purchaseOrders: data?.map((order, index) => ({
                        "key": index + 1,
                        "_id": order?._id,
                        "name": order?.user?.name,
                        "surname": order?.user?.surname,
                        "products": order?.products.map((product) => ({
                            id: product.product._id,
                            name: product.product.name,
                            price: product.product.price,
                            quantity: product.quantity,
                            image: product.product.image,
                        })),
                        "status": order?.status[order?.status.length - 1].status,
                        "voucher_status": order?.voucher?.statuses[order?.voucher?.statuses.length - 1].status,
                        "voucher_image": order?.voucher?.statuses?.image,
                        "total": order?.total,
                        "created_at": moment.unix(order?.created_at).format('DD/MM/YYYY'),
                    }))
                });
            })
            .catch((error) => {
                if (error?.response?.data?.message) {
                    return message.error(error?.response?.data?.message);
                }
                return message.error("No se pudieron obtener las ordenes de compra, por favor recargue la página")
            }).finally(() => this.setState({loading: false}));
    }

    confirmDeleteModal(purchaseOrder) {
        return Modal.confirm({
            title: "Eliminar Orden de Compra",
            icon: <ExclamationCircleOutlined/>,
            content: `¿Estás seguro que deseas eliminar la orden de compra de: ${purchaseOrder.name + ' ' + purchaseOrder.surname}?`,
            okText: "Aceptar",
            okType: "danger",
            onOk: () => this.deletePurchaseOrder(purchaseOrder),
            visible: true,
            cancelText: "Cancelar"
        });
    };

    deletePurchaseOrder(purchaseOrder) {
        axiosConfig().delete(`shopping-carts/${purchaseOrder._id}`).then(() => message.success("Se ha eliminado exitósamente la orden de compra"))
            .catch((error) => {
                if (error?.response?.data?.message) {
                    return message.error(error?.response?.data?.message);
                }
                return message.error("No se pudo eliminar la orden de compra, por favor intentelo mas tarde")
            }).finally(() => this.getPurchaseOrders())
    }

    componentDidMount() {
        this.getPurchaseOrders()
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

    render() {
        const columns: ColumnsType<PurchaseOrdersTable> = [
            {
                title: 'ID',
                dataIndex: 'key',
                key: 'key',
            },
            {
                title: 'Usuario',
                dataIndex: 'name',
                key: 'name',
                render: (value, record) => (<Text>{`${record.name} ${record.surname}`}</Text>),
            },
            {
                title: 'Fecha Ingreso',
                dataIndex: 'created_at',
                key: 'created_at',
                ...this.getColumnSearchProps('created_at')
            },
            {
                title: 'Total',
                dataIndex: 'total',
                key: 'total',
                ...this.getColumnSearchProps('total')
            },
            {
                title: 'Contacto',
                dataIndex: 'status',
                key: 'status',
                ...this.getColumnSearchProps('status')
            },
            {
                title: 'Voucher',
                dataIndex: 'voucher_status',
                key: 'voucher_status',
                ...this.getColumnSearchProps('voucher_status')
            },
            {
                title: 'Acciones',
                dataIndex: 'key',
                key: 'actions',
                render: (key, record) => (
                    <Space size="middle">
                        <Button shape="circle" icon={<EditOutlined/>} onClick={() => {
                            this.setState({visibleEditModal: true, idNews: key - 1});
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
                    <Col className="gutter-row" span={24}>
                        <Title level={2}>Ordenes de compra</Title>
                    </Col>
                </Row>
            </div>
            <Table
                columns={columns}
                dataSource={this.state.purchaseOrders}
                scroll={{x: 'max-content'}}
                loading={this.state.loading}
            />
            {
                this.state.visibleEditModal &&
                <EditPurchaseOrderModal
                    visible={this.state.visibleEditModal}
                    initialValues={this.state.purchaseOrders[this.state.idPurchaseOrder]}
                    onClose={() => {
                        this.getPurchaseOrders();
                        this.setState({visibleEditModal: false})
                    }}
                />
            }
        </div>
    }
}

export default PurchaseOrders;
