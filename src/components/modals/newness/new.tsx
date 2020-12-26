import React, {FunctionComponent, useState} from "react";
import {message, Modal} from "antd";
import {NewnessTable} from "../../../pages/admin/newness/Newness";
import NewnessForm, {NewnessValues} from "../../forms/newness/newness-form";
import {axiosConfig} from "../../_helpers/axiosConfig";

interface NewNewnessModalValues {
    visible: boolean,
    initialValues: NewnessValues,

    onClose(): void
}

const NewNewnessModal: FunctionComponent<NewNewnessModalValues> = ({visible, initialValues, onClose}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [newness, setNewness] = useState<NewnessTable>()

    const saveNewness = (data: NewnessValues) => {
        setLoading(true);
        axiosConfig().post('newness', data)
            .then(() => {
                message.success("Se ha creado exitósamente la novedad")
                onClose();
            })
            .catch((error) => {
                if (error?.response?.data?.messsage) {
                    return message.error(error?.response?.data?.messsage)
                }
                console.log(error)
                return message.error("No se ha podido crear la novedad, vuelva a intentarlo más tarde")
            })
            .finally(() => {
                setLoading(false)
            })
    }

    return (
        <Modal
            title={"Agregar novedad"}
            visible={visible}
            maskClosable={false}
            footer={null}
            onCancel={onClose}
        >
            <NewnessForm
                loading={loading}
                initialValues={initialValues}
                onSubmit={saveNewness}
                onCancel={onClose}
            />
        </Modal>
    );
}
export default NewNewnessModal;
