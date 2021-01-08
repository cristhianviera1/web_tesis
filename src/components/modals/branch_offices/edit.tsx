import React, {FunctionComponent, useState} from "react";
import {message, Modal} from "antd";
import BranchOfficeForm, {BranchOfficeValues} from "../../forms/branch_offices/branch-office-form";
import {axiosConfig} from "../../_helpers/axiosConfig";

interface EditBranchModalValues {
    visible: boolean,
    initialValues: BranchOfficeValues,

    onClose(): void
}

const EditBranchModal: FunctionComponent<EditBranchModalValues> = ({visible, initialValues, onClose}) => {
    const [loading, setLoading] = useState<boolean>(false);

    const saveBranch = (data: BranchOfficeValues) => {
        setLoading(true);
        axiosConfig().put('branch-offices', {...data, _id: data.id})
            .then(() => message.success("Se ha editado exitósamente la sucursal"))
            .catch((error) => {
                if (error?.response?.data?.messsage) {
                    return message.error(error?.response?.data?.messsage)
                }
                return message.error("No se ha podido actualizar la sucursal, vuelva a intentarlo más tarde")
            })
            .finally(() => {
                setLoading(false)
                onClose();
            })
    }

    return (
        <Modal
            title={'Editar sucursal'}
            visible={visible}
            maskClosable={false}
            footer={null}
            onCancel={onClose}
        >
            <BranchOfficeForm
                loading={loading}
                onSubmit={saveBranch}
                initialValues={initialValues}
                onCancel={onClose}
            />
        </Modal>
    );
}
export default EditBranchModal;
