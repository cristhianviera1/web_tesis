import React, {FunctionComponent, useEffect} from "react";
import {Button, Form, Input, Upload, Space, Typography} from "antd";
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import * as yup from 'yup';
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers";

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
        description: yup.string().email().required(),
        image: yup.string().max(50).min(5).required(),
    })

    const {control, errors, handleSubmit, reset} = useForm<NewnessValues>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            ...initialValues
        }
    })

    const normFile = e => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    useEffect(() => {
        reset(initialValues)
    }, [initialValues])

    return (
        <Form layout={'vertical'} onFinish={handleSubmit(onSubmit)}>

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
            <Form.Item label={"Dirección 1"}>
                <Controller
                    name={'description'}
                    as={TextArea}
                    control={control}
                />
                {
                    errors.description && <Text type={'danger'}>{errors.description.message}</Text>
                }
            </Form.Item>
            <Form.Item label="Dragger">
                <Form.Item name="dragger" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
                    <Upload.Dragger name="files" action="/upload.do" multiple={false}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Da click o arrastra una foto a esta area para subirla</p>
                        <p className="ant-upload-hint">Support for a single or bulk upload.</p>
                    </Upload.Dragger>
                </Form.Item>
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
