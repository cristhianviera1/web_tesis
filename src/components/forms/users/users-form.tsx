import React, {FunctionComponent, useEffect, useState} from "react";
import {Button, Form, Input, Space, Typography, Row, Col, Switch, Select, Upload, message, DatePicker} from "antd";
import * as yup from 'yup';
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers";
import {CheckOutlined, CloseOutlined, PlusCircleOutlined} from "@ant-design/icons";

const {Text} = Typography
const { Option } = Select;


export interface UsersValues {
    id?: string;
    dni?: string;
    name: string;
    surname: string;
    gender: string;
    birthday?: string;
    password: string;
    phone: number;
    email: string;
    status?: boolean;
    roles: string;
    image?: string;
}

interface UsersForm {
    loading: boolean,
    initialValues?: UsersValues,

    onSubmit(data: UsersValues): void

    onCancel(): void
}

const UsersForm: FunctionComponent<UsersForm> = ({initialValues, loading, onSubmit, onCancel}) => {
    const validationSchema = yup.object().shape({
        dni: yup.string().max(10).min(10).required(),
        name: yup.string().max(50).required(),
        surname: yup.string().max(50).required(),
        gender: yup.string().required(),
        birthday: yup.string().required(),
        password: yup.string().required(),
        phone: yup.number().min(9).required(),
        email: yup.string().email().required(),
        status: yup.boolean().required(),
        roles: yup.string().required(),
    })

    const [loadingImage, setLoadingImage] = useState<boolean>(false)

    const {control, errors, handleSubmit, reset, setValue, watch, register} = useForm<UsersValues>({
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
                    name={'id'}
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
                            control={control}
                        />
                        {
                            errors.name && <Text type={'danger'}>{errors.name.message}</Text>
                        }
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label={"Apellido"}>
                        <Controller
                            name={'surname'}
                            as={Input}
                            control={control}
                        />
                        {
                            errors.surname && <Text type={'danger'}>{errors.surname.message}</Text>
                        }
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={{xs: 8, sm: 16, md: 24, lg: 32}}>
                <Col span={12}>
                    <Form.Item label={"Contraseña"}>
                        <Controller
                            name={'password'}
                            as={Input.Password}
                            control={control}
                        />
                        {
                            errors.password && <Text type={'danger'}>{errors.password.message}</Text>
                        }
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label={"Genero"}>
                        <Controller
                            name={'gender'}
                            as={Select}
                            allowClear
                            placeholder={"Por favor selecciona"}
                            style={{ width: '100%'}}
                            control={control}
                        >
                            <Option value="man">Masculino</Option>
                            <Option value="woman">Femenino</Option>
                            <Option value="other">Otro</Option>
                        </Controller>
                        {
                            errors.gender && <Text type={'danger'}>{errors.gender.message}</Text>
                        }
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={{xs: 8, sm: 16, md: 24, lg: 32}}>
                <Col span={12}>
                    <Form.Item label={"Fecha de nacimiento"}>
                        <Controller
                            name={'birthday'}
                            as={DatePicker}
                            placeholder={"Por favor selecciona"}
                            style={{ width: '100%'}}
                            control={control}
                        />
                        {
                            errors.birthday && <Text type={'danger'}>{errors.birthday.message}</Text>
                        }
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label={"Roles"}>
                        <Controller
                            name={'roles'}
                            as={Select}
                            allowClear
                            placeholder={"Por favor selecciona"}
                            style={{ width: '100%'}}
                            control={control}
                        >
                            <Option value="admin">Administrador</Option>
                            <Option value="branch_admin">Sucursal</Option>
                            <Option value="brigadista">Brigadista</Option>
                            <Option value="client">Usuario</Option>
                        </Controller>
                        {
                            errors.roles && <Text type={'danger'}>{errors.roles.message}</Text>
                        }
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={{xs: 8, sm: 16, md: 24, lg: 32}}>
                <Col span={8}>
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
                <Col span={8}>
                    <Form.Item label={"Teléfono"}>
                        <Controller
                            name={'phone'}
                            as={Input}
                            type={'number'}
                            control={control}
                            min={0}
                        />
                        {
                            errors.phone && <Text type={'danger'}>{errors.phone.message}</Text>
                        }
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label={"Email"}>
                        <Controller
                            name={'email'}
                            as={Input}
                            control={control}
                        />
                        {
                            errors.email && <Text type={'danger'}>{errors.email.message}</Text>
                        }
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item label={"Imagen"} style={{width:'100%', display:'flex',justifyContent:'center',textAlign:'center'}}>
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
export default UsersForm;
