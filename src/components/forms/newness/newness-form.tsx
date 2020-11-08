import React, {FunctionComponent, useEffect, useState} from "react";
import {Button, Form, Input, message, Space, Typography, Upload} from "antd";
import * as yup from 'yup';
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers";
import {PlusCircleOutlined} from "@ant-design/icons";

const {Text} = Typography
const {TextArea} = Input;

export interface NewnessValues {
    _id?: string;
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
    const [loadingImage, setLoadingImage] = useState<boolean>(false)

    const {control, errors, handleSubmit, reset, setValue, watch, register} = useForm<NewnessValues>({
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
export default NewnessForm;
