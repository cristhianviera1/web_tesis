import React, {FunctionComponent, useEffect} from "react";
import {Button, Form, Input, Space, Typography} from "antd";
import * as yup from 'yup';
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers";
import FileBase64 from 'react-file-base64';

const {Text} = Typography
const { TextArea } = Input;

export interface NewnessValues {
    id?: string;
    title: string;
    description: string;
    image: string;
}

interface NewnessForm {
    loading: boolean,
    initialValues?: NewnessValues,

    onSubmit(data: NewnessValues): void

    onCancel(): void

}

const NewnessForm: FunctionComponent<NewnessForm> = ({initialValues, loading, onSubmit, onCancel}) => {
    const validationSchema = yup.object().shape({
        title: yup.string().max(50).min(5).required(),
        description: yup.string().max(500).min(50).required(),
        image: yup.string().required(),
    })

    const {control, errors, handleSubmit, reset} = useForm<NewnessValues>({
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
                {
                    errors.id && <Text type={'danger'}>{errors.id.message}</Text>
                }
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
            <Form.Item label={"Descripción"}>
                <Controller
                    name={'description'}
                    as={TextArea}
                    control={control}
                />
                {
                    errors.description && <Text type={'danger'}>{errors.description.message}</Text>
                }
            </Form.Item>
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
export default NewnessForm;
