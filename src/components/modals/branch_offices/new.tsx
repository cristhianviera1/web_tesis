import React, {FunctionComponent, useState} from "react";
import {message, Modal} from "antd";
import BranchOfficeForm, {BranchOfficeValues} from "../../forms/branch_offices/branch-office-form";
import {axiosConfig} from "../../_helpers/axiosConfig";

interface NewBranchModalValues {
    visible: boolean,
    initialValues: BranchOfficeValues,

    onClose(): void
}

export interface BranchOffice {
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

const NewBranchModal: FunctionComponent<NewBranchModalValues> = ({visible, initialValues, onClose}) => {
    const [loading, setLoading] = useState<boolean>(false);

    const saveBranch = (data) => {
        setLoading(true);
        axiosConfig().post('branch-offices', data)
            .then(() => message.success("Se ha creado exitósamente la sucursal"))
            .catch((error) => {
                console.log(error.response);
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
            title={'Agregar sucursal'}
            visible={visible}
            maskClosable={false}
            footer={null}
            onCancel={onClose}
        >
            <BranchOfficeForm
                loading={loading}
                initialValues={initialValues}
                onSubmit={saveBranch}
                onCancel={onClose}
            />
        </Modal>
    );
}
export default NewBranchModal;
