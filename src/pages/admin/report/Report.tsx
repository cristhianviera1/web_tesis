import React, {Component} from 'react';
import {Button, Col, Input, message, Modal, Row, Space, Table, Typography} from 'antd';
import {ColumnsType} from 'antd/lib/table';
import {FileExcelOutlined, SearchOutlined} from '@ant-design/icons';
import {axiosConfig} from '../../../components/_helpers/axiosConfig';
import Highlighter from "react-highlight-words";
import moment from "moment";
import ExportJsonExcel from 'js-export-excel';

const {Title, Text} = Typography;

export interface OrdersReportTable {
    _id: string;
    key: number;
    name: string;
    surname: string;
    products: [];
    status: string;
    voucher_status: string;
    voucher_image: string;
    total: string;
    created_at: string;
}

class OrdersReport extends Component {

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
                        "products": order?.products,
                        "status": order?.status[0].status,
                        "voucher_status": order?.voucher?.statuses[0].status,
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

    downloadExcel() {
        const data = this.state.purchaseOrders ? this.state.purchaseOrders : '';
        let options = {
            fileName : '',
            datas : []
        };

        let dataTable = [];

        if(data) {
            for(let i in data) {
                if(data) {
                    let obj = {
                        'Nº': data[i].key,
                        'Nombre': data[i].name,
                        'Apellido': data[i].surname,
                        'Status': data[i].status,
                        'Productos': data[i].products,
                        'Voucher': data[i].voucher_status,
                        'Total': data[i].total,
                        'Creacion': data[i].created_at
                    }
                    dataTable.push(obj);
                }
            }
        }

        options.fileName = 'Reporte Kimirina';
        options.datas = [{
            sheetData: dataTable,
            sheetName: 'sheet',
            sheetFilter: ['Nº','Nombre','Apellido','Status','Productos','Voucher','Total','Creacion'],
            sheetHeader: ['Nº','Nombre','Apellido','Status','Productos','Voucher','Total','Creacion'],
        }]

        let toExcel = new ExportJsonExcel(options);
        toExcel.saveExcel();
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
        const columns: ColumnsType<OrdersReportTable> = [
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
        ];

        return <div>
            <div>
                <Row gutter={{xs: 8, sm: 16, md: 24, lg: 32}}>
                    <Col className="gutter-row" span={20}>
                        <Title level={2}>Reporte de ordenes de compra</Title>
                    </Col>
                    <Col className="gutter-row" span={4}>
                        <Button type="primary" style={{backgroundColor:"green"}} icon={<FileExcelOutlined />} onClick={() => {
                            this.downloadExcel();}
                        }>
                            Exportar a excel
                        </Button>
                    </Col>
                </Row>
            </div>
            <Table
                columns={columns}
                dataSource={this.state.purchaseOrders}
                scroll={{x: 'max-content'}}
                loading={this.state.loading}
            />
        </div>
    }
}

export default OrdersReport;
