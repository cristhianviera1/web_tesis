import React, {FunctionComponent, useState} from "react";
import {message, Modal} from "antd";
import {BranchOfficeTable} from "../../../pages/admin/branch-office/BranchOffice";
import BranchOfficeForm, {BranchOfficeValues} from "../../forms/branch_offices/branch-office-form";
import {axiosConfig} from "../../_helpers/axiosConfig";

interface EditBranchModalValues {
    visible: boolean,
    initialValues: BranchOfficeValues,

    onClose(): void
}

const EditBranchModal: FunctionComponent<EditBranchModalValues> = ({visible, initialValues, onClose}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [branchOffice, setBranchOffice] = useState<BranchOfficeTable>()
    const office = {
        _id: "",
        name: "",
        email: "",
        address: {
            first_address: "",
            second_address: "",
            country: "",
            state: "",
            city: "",
            latitude: "",
            longitude: "",
        }
    }

    const saveBranch = (data) => {
        office._id= data.id
        office.name=data.name
        office.email=data.email
        office.address.first_address=data.first_address
        office.address.second_address=data.second_address
        office.address.country=data.country
        office.address.state=data.state
        office.address.city=data.city
        office.address.latitude=data.latitude
        office.address.longitude=data.longitude
        setLoading(true);
        axiosConfig().put('branch-offices', office)
            .then(() => message.success("Se ha editado exitósamente la sucursal"))
            .catch((error) => {
                if (error?.response?.data?.messsage) {
                    return message.error(error?.response?.data?.messsage)
                }
                return message.error("No se ha podido actualizar la sucursal, vuelva a intentarlo más tarde")
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
