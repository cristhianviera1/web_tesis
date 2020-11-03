import React, {FunctionComponent, useEffect} from "react";
import {Button, Form, Input, Space, Typography, Row, Col, Switch, Select, Tag} from "antd";
import * as yup from 'yup';
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers";
import FileBase64 from 'react-file-base64';
import {CheckOutlined, CloseOutlined} from "@ant-design/icons";

const {Text} = Typography
const { TextArea } = Input;

export interface ProductsValues {
    id?: string;
    title: string;
    detail: string;
    price: number;
    category: string;
    stock: number;
    status?: boolean;
    image: string;
}

interface ProductsForm {
    loading: boolean,
    initialValues?: ProductsValues,

    onSubmit(data: ProductsValues): void

    onCancel(): void
}

const options = [{ value: 'gold' }, { value: 'lime' }, { value: 'green' }, { value: 'cyan' }];

function tagRender(props) {
    const { label, value, closable, onClose } = props;

    return (
        <Tag color={value} closable={closable} onClose={onClose} style={{ marginRight: 3 }}>
            {label}
        </Tag>
    );
}

const ProductsForm: FunctionComponent<ProductsForm> = ({initialValues, loading, onSubmit, onCancel}) => {
    const validationSchema = yup.object().shape({
        title: yup.string().max(50).min(5).required(),
        detail: yup.string().max(500).min(50).required(),
        price: yup.number().min(0).positive().required(),
        category: yup.string().max(500).min(50).required(),
        stock: yup.string().min(0).positive().required(),
        status: yup.boolean().required(),
        image: yup.string().required(),
    })

    const {control, errors, handleSubmit, reset} = useForm<ProductsValues>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            ...initialValues
        }
    })

    const getFiles = files =>{
        let base = (document.getElementById('image') as HTMLInputElement);
        base.value = files.base64
    }

    useEffect(() => {
        reset(initialValues)
    }, [initialValues])

    return (
        <Form layout={'vertical'} onFinish={handleSubmit(onSubmit)}>
            <Form.Item label={"ID"} hidden={true}>
                <Controller
                    name={'id'}
                    as={Input}
                    control={control}
                />
            </Form.Item>
            <Form.Item label={"Título"}>
                <Controller
                    name={'title'}
                    as={Input}
                    control={control}
                />
                {
                    errors.title && <Text type={'danger'}>{errors.title.message}</Text>
                }
            </Form.Item>
            <Form.Item label={"Detalle"}>
                <Controller
                    name={'detail'}
                    as={TextArea}
                    control={control}
                />
                {
                    errors.detail && <Text type={'danger'}>{errors.detail.message}</Text>
                }
            </Form.Item>
            <Form.Item label={"Categoria"}>
                <Controller
                    name={'category'}
                    as={Select}
                    showArrow
                    tagRender={tagRender}
                    style={{ width: '100%'}}
                    options={options}
                    control={control}
                />
                {
                    errors.category && <Text type={'danger'}>{errors.category.message}</Text>
                }
            </Form.Item>
            <Row gutter={{xs: 8, sm: 16, md: 24, lg: 32}}>
                <Col span={12}>
                    <Form.Item label={"Precio"}>
                        <Controller
                            name={'price'}
                            as={Input}
                            type={'number'}
                            control={control}
                        />
                        {
                            errors.price && <Text type={'danger'}>{errors.price.message}</Text>
                        }
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label={"Stock"}>
                        <Controller
                            name={'stock'}
                            as={Input}
                            type={'number'}
                            control={control}
                        />
                        {
                            errors.stock && <Text type={'danger'}>{errors.stock.message}</Text>
                        }
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label={"Estatus"}>
                        <Controller
                            name={'status'}
                            as={Switch}
                            checkedChildren={<CheckOutlined />}
                            unCheckedChildren={<CloseOutlined />}
                            defaultChecked
                            control={control}
                        />
                        {
                            errors.status && <Text type={'danger'}>{errors.status.message}</Text>
                        }
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item label={"Imagen"}>
                <FileBase64
                    multiple={false}
                    accept={'image/*'}
                    onDone={getFiles.bind(this)}
                />
                {
                    errors.image && <Text type={'danger'}>{errors.image.message}</Text>
                }
            </Form.Item>

            <Form.Item label={"Imagen"}>
                <Controller
                    id={'image'}
                    itemID={'image'}
                    name={'image'}
                    as={Input}
                    control={control}
                />
            </Form.Item>


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
export default ProductsForm;
