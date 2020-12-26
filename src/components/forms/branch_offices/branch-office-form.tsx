import React, {FunctionComponent, useEffect, useState} from "react";
import {Button, Col, Form, Input, Row, Select, Space, Typography} from "antd";
import * as yup from 'yup';
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers";
import {axiosConfig} from "../../_helpers/axiosConfig";

const {TextArea} = Input;

const {Text} = Typography


export interface City {
    _id?: string;
    name: string;
}

export interface State {
    _id?: string;
    name: string;
    cities: City[];
}

export interface Country {
    _id?: string;
    name: string;
    states: State[];
}

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
    const [countries, setCountries] = useState<Country[]>();
    const [country, setCountry] = useState<number>();
    const [state, setState] = useState<number>();
    const [city, setCity] = useState<number>();

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

    const {control, errors, handleSubmit, reset, setValue} = useForm<BranchOfficeValues>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            ...initialValues
        }
    })

    const getCountries = () => {
        axiosConfig()
            .get("countries")
            .then(({data}) => {
                setCountries(data);
            })
    }

    useEffect(() => {
        reset(initialValues)
        if (!countries) {
            getCountries();
        }
        //Buscamos los index para poder llenar los select
        if (initialValues && countries) {
            const countryIndex = countries?.findIndex(
                (country) => country.name === initialValues.country
            );
            if (countryIndex !== -1) {
                setCountry(countryIndex);
                const stateIndex = countries[countryIndex]?.states?.findIndex((state) => state.name === initialValues.state)
                setState(stateIndex);
                setCity(countries[countryIndex]?.states[stateIndex]?.cities?.findIndex((city) => city.name === initialValues.city))
            }
        }
    }, [countries, initialValues])

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
                </Col>
                <Col span={12}>
                    <Form.Item label={"* Email"}>
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
            <Form.Item label={"* Dirección 1"}>
                <Controller
                    name={'first_address'}
                    as={TextArea}
                    rows={2}
                    control={control}
                />
                {
                    errors.first_address && <Text type={'danger'}>{errors.first_address.message}</Text>
                }
            </Form.Item>
            <Form.Item label={"Dirección 2"}>
                <Controller
                    name={'second_address'}
                    as={TextArea}
                    rows={2}
                    control={control}
                />
                {
                    errors.second_address && <Text type={'danger'}>{errors.second_address.message}</Text>
                }
            </Form.Item>
            <Row gutter={{xs: 8, sm: 16, md: 24, lg: 32}}>
                <Col span={8}>
                    <Form.Item label={"* País"}>
                        <Controller
                            name={"country"}
                            as={Select}
                            showSearch
                            optionFilterProp={"label"}
                            control={control}
                            onSelect={(value, obj) => {
                                setCountry(obj.key);
                                setValue("state", undefined);
                                setValue("city", undefined);
                            }}
                            options={countries?.map((country, index) => ({
                                label: country.name,
                                value: country.name,
                                key: index,
                            }))}
                        />
                        {errors.country && (
                            <Text type="danger">{errors.country.message}</Text>
                        )}
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label={"* Provincia"}>
                        <Controller
                            name={"state"}
                            as={Select}
                            showSearch
                            optionFilterProp={"label"}
                            control={control}
                            onSelect={(value, object) => {
                                setState(object.key);
                                setValue("city", undefined);
                            }}
                            options={
                                countries &&
                                countries[country]?.states?.map(
                                    (states, index) => ({
                                        label: states.name,
                                        value: states.name,
                                        key: index,
                                    })
                                )
                            }
                        />
                        {errors.state && (
                            <Text type="danger">{errors.state.message}</Text>
                        )}
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label={"* Ciudad"}>
                        <Controller
                            name={"city"}
                            as={Select}
                            showSearch
                            optionFilterProp={"label"}
                            control={control}
                            onSelect={(value, object) => {
                                setCity(object.key);
                            }}
                            options={
                                countries &&
                                countries[country]?.states[state]?.cities?.map(
                                    (cities, index) => ({
                                        label: cities.name,
                                        value: cities.name,
                                        key: index,
                                    })
                                )
                            }
                        />
                        {errors.city && (
                            <Text type="danger">{errors.city.message}</Text>
                        )}
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={{xs: 8, sm: 16, md: 24, lg: 32}}>
                <Col span={12}>
                    <Form.Item label={"* Latitud"}>
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
                    <Form.Item label={"* Longitud"}>
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
