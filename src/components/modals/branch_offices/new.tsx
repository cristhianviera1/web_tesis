import React, {FunctionComponent, useState} from "react";
import {message, Modal} from "antd";
import {BranchOfficeTable} from "../../../pages/admin/branch-office/BranchOffice";
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
    address: {
        first_address: string;
        second_address: string;
        country: string;
        state: string;
        city: string;
        latitude: string;
        longitude: string;
    }
}

const NewBranchModal: FunctionComponent<NewBranchModalValues> = ({visible, initialValues, onClose}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [branchOffice, setBranchOffice] = useState<BranchOfficeTable>()
    const office = {
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
        axiosConfig().post('branch-offices', office)
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
