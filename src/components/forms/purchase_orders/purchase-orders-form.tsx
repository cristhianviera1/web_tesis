import React, {FunctionComponent, useEffect} from "react";
import {Button, Col, Form, Image, Input, Row, Select, Space, Table, Typography} from "antd";
import * as yup from 'yup';
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers";

const {Text} = Typography
const {Option} = Select;

export interface ProductsTable {
    id: string;
    name: string;
    quantity: string;
    price: string;
    image: string;
}

export interface PurchaseOrdersValues {
    _id: string;
    name: string;
    surname: string;
    products: ProductsTable[];
    status: string;
    voucher_status: string;
    voucher_image: string;
    total: string;
    created_at: string;
}

interface PurchaseOrderForm {
    loading: boolean,
    initialValues?: PurchaseOrdersValues,

    onSubmit(data: PurchaseOrdersValues): void

    onCancel(): void

}

const PurchaseOrderForm: FunctionComponent<PurchaseOrderForm> = ({initialValues, loading, onSubmit, onCancel}) => {
    const validationSchema = yup.object().shape({
        status: yup.string().required(),
        voucher_status: yup.string().required(),
    })

    const {control, errors, handleSubmit, reset} = useForm<PurchaseOrdersValues>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            ...initialValues
        }
    })
    useEffect(() => {
        reset(initialValues);
    }, [initialValues])

    const columns = [
        {
            title: 'Nº',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Imagen',
            dataIndex: 'image',
            key: 'image',
            render: (text) => (
                <div style={{borderRadius: '50%'}}>
                    <Image src={text} alt={"Imagen del producto"} width={100} height={100}/>
                </div>
            )
        },
        {
            title: 'Producto',
            dataIndex: 'product',
            key: 'product',
        },
        {
            title: 'Cantidad',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Precio',
            dataIndex: 'price',
            key: 'price',
        },
    ]

    const footerTable = 'El total a pagar es: ' + initialValues.total

    const dataTable = initialValues.products.map((product, key) => ({
        "key": key + 1,
        "product": product.name,
        "quantity": product.quantity,
        "price": product.price,
        "image": product.image
    }))

    return (
        <Form layout={'vertical'} onFinish={handleSubmit(onSubmit)}>
            <Form.Item label={"ID"} hidden={true}>
                <Controller
                    name={'_id'}
                    as={Input}
                    control={control}
                />
            </Form.Item>
            <Row gutter={{xs: 8, sm: 16, md: 24, lg: 32}}>
                <Col span={12}>
                    <Form.Item label={"Nombre"}>
                        <Controller
                            name={'name'}
                            as={Input}
                            disabled
                            control={control}
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label={"Apellido"}>
                        <Controller
                            name={'surname'}
                            as={Input}
                            disabled
                            control={control}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item label={"Pedido"}>
                <Table columns={columns} dataSource={dataTable} footer={() => footerTable}/>
            </Form.Item>
            <Row gutter={{xs: 8, sm: 16, md: 24, lg: 32}}>
                <Col span={12}>
                    <Form.Item label={"* Contacto"}>
                        <Controller
                            name={'status'}
                            as={Select}
                            allowClear
                            placeholder={"Por favor selecciona"}
                            style={{width: '100%'}}
                            control={control}
                        >
                            <Option value="esperando contacto">Esperando Contacto</Option>
                            <Option value="en contacto">En Contacto</Option>
                            <Option value="pendiente entrega">Pendiente Entrega</Option>
                            <Option value="entregado">Entregado</Option>
                            <Option value="anulado">Anulado</Option>
                        </Controller>
                        {
                            errors.status && <Text type={'danger'}>{errors.status.message}</Text>
                        }
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label={"* Voucher"}>
                        <Controller
                            name={'voucher_status'}
                            as={Select}
                            allowClear
                            placeholder={"Por favor selecciona"}
                            style={{width: '100%'}}
                            control={control}
                        >
                            <Option value="pendiente comprobante">Pendiente Comprobante</Option>
                            <Option value="pendiente aprobación">Pendiente Aprobación</Option>
                            <Option value="aprobado">Aprobado</Option>
                            <Option value="denegado">Denegado</Option>
                        </Controller>
                        {
                            errors.voucher_status && <Text type={'danger'}>{errors.voucher_status.message}</Text>
                        }
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item style={{textAlign: 'end'}}>
                <Space>
                    <Button danger onClick={onCancel}>
                        Cancelar
                    </Button>
                    <Button
                        type={'primary'}
                        loading={loading}
                        disabled={loading}
                        htmlType={'submit'}
                    >
                        Guardar
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
}
export default PurchaseOrderForm;
