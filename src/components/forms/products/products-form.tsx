import React, {FunctionComponent, useEffect, useState} from "react";
import {Button, Col, Form, Input, InputNumber, message, Row, Space, Switch, Typography, Upload} from "antd";
import * as yup from 'yup';
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers";
import {PlusCircleOutlined} from "@ant-design/icons";

const {Text} = Typography
const {TextArea} = Input;

const options = [
    { label: 'Activo', value: 'true' },
    { label: 'Inactivo', value: 'false' },
];

export interface ProductsValues {
    _id?: string;
    name: string;
    detail: string;
    price: number;
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

const ProductsForm: FunctionComponent<ProductsForm> = ({initialValues, loading, onSubmit, onCancel}) => {
    const validationSchema = yup.object().shape({
        name: yup.string().max(50).min(5).required(),
        detail: yup.string().max(500).min(50).required(),
        price: yup.number().min(0).required(),
        stock: yup.number().min(0).required(),
        status: yup.boolean().required(),
        image: yup.string().required(),
    })
    const [loadingImage, setLoadingImage] = useState<boolean>(false)

    const {control, errors, handleSubmit, reset, setValue, watch, register} = useForm<ProductsValues>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            ...initialValues
        }
    })
    useEffect(() => {
        reset(initialValues)
        register('image')
    }, [initialValues])

    const imageValue = watch('image');

    function beforeUpload(file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
        if (!isJpgOrPng) {
            message.error("El formato no es permitido. Los formatos permitidos son: jpeg, jpg, png");
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error("El peso es superior a 2MB");
        }
        return isJpgOrPng && isLt2M;
    }

    function getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    const onChange = async (info) => {
        const nextState: any = {};
        switch (info.file.status) {
            case "uploading":
                setLoadingImage(true)
                nextState.image = info.file;
                nextState.image.url = await getBase64(info.file.originFileObj);
                break;

            case "done":
                nextState.image = info.file;
                setLoadingImage(false);
                break;

            default:
                setLoadingImage(false);
        }
        setValue('image', nextState?.image?.url);
    };

    return (
        <Form layout={'vertical'} onFinish={handleSubmit(onSubmit)}>
            <Form.Item label={"ID"} hidden={true}>
                <Controller
                    name={'_id'}
                    as={Input}
                    control={control}
                />
            </Form.Item>
            <Form.Item label={"* Nombre"}>
                <Controller
                    name={'name'}
                    as={Input}
                    control={control}
                />
                {
                    errors.name && <Text type={'danger'}>{errors.name.message}</Text>
                }
            </Form.Item>
            <Form.Item label={"* Detalle"}>
                <Controller
                    name={'detail'}
                    as={TextArea}
                    control={control}
                />
                {
                    errors.detail && <Text type={'danger'}>{errors.detail.message}</Text>
                }
            </Form.Item>
            <Row gutter={{xs: 8, sm: 16, md: 24, lg: 32}}>
                <Col span={8}>
                    <Form.Item label={"* Estado"}>
                        <Controller
                            name={'status'}
                            as={Switch}
                            control={control}
                            defaultChecked
                        />
                        {
                            errors.status && <Text type={'danger'}>{errors.status.message}</Text>
                        }
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label={"* Precio"}>
                        <Controller
                            name={'price'}
                            as={InputNumber}
                            min={0}
                            step={0.1}
                            control={control}
                        />
                        {
                            errors.price && <Text type={'danger'}>{errors.price.message}</Text>
                        }
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label={"* Stock"}>
                        <Controller
                            name={'stock'}
                            as={InputNumber}
                            min={0}
                            control={control}
                        />
                        {
                            errors.stock && <Text type={'danger'}>{errors.stock.message}</Text>
                        }
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item label={"* Imagen"}
                       style={{width: '100%', display: 'flex', justifyContent: 'center', textAlign: 'center'}}>
                <Upload
                    name="image"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    customRequest={() => {
                    }}
                    beforeUpload={beforeUpload}
                    onChange={info => {
                        onChange(info)
                    }}
                >
                    {
                        imageValue ?
                            <img src={imageValue} alt="avatar"
                                 style={{width: '100%'}}/>
                            :
                            <div>
                                <PlusCircleOutlined />
                                <div className="ant-upload-text">Subir Imagen</div>
                            </div>
                    }
                </Upload>
                {
                    errors.image && <Text type={'danger'}>{errors.image.message}</Text>
                }
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
