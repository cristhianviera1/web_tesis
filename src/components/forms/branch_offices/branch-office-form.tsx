import React, {FunctionComponent, useEffect} from "react";
import {Button, Col, Form, Input, Row, Space, Typography} from "antd";
import * as yup from 'yup';
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers";

const {Text} = Typography

export interface BranchOfficeValues {
    id?: string;
    name: string;
    email: string;
    first_address: string;
    second_address: string;
    country: string;
    state: string;
    city: string;
    latitude: string;
    longitude: string;
}

interface BranchOfficeForm {
    loading: boolean,
    initialValues?: BranchOfficeValues,

    onSubmit(data: BranchOfficeValues): void

    onCancel(): void

}

const BranchOfficeForm: FunctionComponent<BranchOfficeForm> = ({initialValues, loading, onSubmit, onCancel}) => {
    const validationSchema = yup.object().shape({
        name: yup.string().max(50).min(5).required(),
        email: yup.string().email().required(),
        first_address: yup.string().max(50).min(5).required(),
        second_address: yup.string().max(50).min(5).required(),
        country: yup.string().max(50).min(5).required(),
        state: yup.string().max(50).min(5).required(),
        city: yup.string().max(50).min(5).required(),
        latitude: yup.string().max(20).min(5).required(),
        longitude: yup.string().max(20).min(5).required(),
    })

    const {control, errors, handleSubmit, reset} = useForm<BranchOfficeValues>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            ...initialValues
        }
    })

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
                {
                    errors.id && <Text type={'danger'}>{errors.id.message}</Text>
                }
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
            <Form.Item label={"Dirección 1"}>
                <Controller
                    name={'first_address'}
                    as={Input}
                    control={control}
                />
                {
                    errors.first_address && <Text type={'danger'}>{errors.first_address.message}</Text>
                }
            </Form.Item>
            <Form.Item label={"Dirección 2"}>
                <Controller
                    name={'second_address'}
                    as={Input}
                    control={control}
                />
                {
                    errors.second_address && <Text type={'danger'}>{errors.second_address.message}</Text>
                }
            </Form.Item>
            <Row gutter={{xs: 8, sm: 16, md: 24, lg: 32}}>
                <Col span={8}>
                    <Form.Item label={"País"}>
                        <Controller
                            name={'country'}
                            as={Input}
                            control={control}
                        />
                        {
                            errors.country && <Text type={'danger'}>{errors.country.message}</Text>
                        }
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label={"Provincia"}>
                        <Controller
                            name={'state'}
                            as={Input}
                            control={control}
                        />
                        {
                            errors.state && <Text type={'danger'}>{errors.state.message}</Text>
                        }
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label={"Ciudad"}>
                        <Controller
                            name={'city'}
                            as={Input}
                            control={control}
                        />
                        {
                            errors.city && <Text type={'danger'}>{errors.city.message}</Text>
                        }
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={{xs: 8, sm: 16, md: 24, lg: 32}}>
                <Col span={12}>
                    <Form.Item label={"Latitud"}>
                        <Controller
                            name={'latitude'}
                            as={Input}
                            control={control}
                        />
                        {
                            errors.latitude && <Text type={'danger'}>{errors.latitude.message}</Text>
                        }
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label={"Longitud"}>
                        <Controller
                            name={'longitude'}
                            as={Input}
                            control={control}
                        />
                        {
                            errors.longitude && <Text type={'danger'}>{errors.longitude.message}</Text>
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
export default BranchOfficeForm;
