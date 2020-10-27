import React, {FunctionComponent, useState} from "react";
import {message, Modal} from "antd";
import {NewnessTable} from "../../../pages/admin/newness/Newness";
import NewnessForm , {NewnessValues} from "../../forms/newness/newness-form";
import {axiosConfig} from "../../_helpers/axiosConfig";

interface NewNewnessModalValues {
    visible: boolean,
    initialValues: NewnessValues,

    onClose(): void
}

const NewNewnessModal: FunctionComponent<NewNewnessModalValues> = ({visible, initialValues, onClose}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [newness, setNewness] = useState<NewnessTable>()

    const saveBranch = (data: NewnessValues) => {
        setLoading(true);
        axiosConfig().post('branch-offices', data)
            .then(() => message.success("Se ha creado exitósamente la sucursal"))
            .catch((error) => {
                if (error?.response?.data?.messsage) {
                    return message.error(error?.response?.data?.messsage)
                }
                return message.error("No se ha podido crear la sucursal, vuelva a intentarlo más tarde")
            })
            .finally(() => {
                setLoading(false)
                onClose();
            })
    }

    return (
        <Modal
            visible={visible}
            maskClosable={false}
            footer={[]}
        >
            <NewnessForm
                loading={loading}
                initialValues={initialValues}
                onSubmit={saveBranch}
                onCancel={onClose}
            />
        </Modal>
    );
}
export default NewNewnessModal;
