import React, {FunctionComponent, useState} from "react";
import {message, Modal} from "antd";
import {NewnessTable} from "../../../pages/admin/newness/Newness";
import NewnessForm , {NewnessValues} from "../../forms/newness/newness-form";
import {axiosConfig} from "../../_helpers/axiosConfig";

interface EditNewnessModalValues {
    visible: boolean,
    initialValues: NewnessValues,

    onClose(): void
}

const EditNewnessModal: FunctionComponent<EditNewnessModalValues> = ({visible, initialValues, onClose}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [newness, setNewness] = useState<NewnessTable>()

    const saveNewness = (data: NewnessValues) => {
        console.log(data._id);
        setLoading(true);
        axiosConfig().put('newness', data)
            .then(() => {
                message.success("Se ha editado exitósamente la novedad")
                onClose();
            })
            .catch((error) => {
                if (error?.response?.data?.messsage) {
                    return message.error(error?.response?.data?.messsage)
                }
                return message.error("No se ha podido actualizar la novedad, vuelva a intentarlo más tarde")
            })
            .finally(() => setLoading(false))
    }

    return (
        <Modal
            visible={visible}
            maskClosable={false}
            closable={false}
            footer={null}
        >
            <NewnessForm
                loading={loading}
                onSubmit={saveNewness}
                initialValues={initialValues}
                onCancel={onClose}
            />
        </Modal>
    );
}
export default EditNewnessModal;
