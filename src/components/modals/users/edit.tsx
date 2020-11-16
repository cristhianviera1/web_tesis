import React, {FunctionComponent, useState} from "react";
import {message, Modal} from "antd";
import {UsersTable} from "../../../pages/admin/users/Users";
import UsersForm , {UsersValues} from "../../forms/users/users-form";
import {axiosConfig} from "../../_helpers/axiosConfig";

interface EditUserModalValues {
    visible: boolean,
    initialValues: UsersValues,

    onClose(): void
}

const EditUserModal: FunctionComponent<EditUserModalValues> = ({visible, initialValues, onClose}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [users, setUsers] = useState<UsersTable>()

    const saveUsers = (data: UsersValues) => {
        setLoading(true);
        axiosConfig().put('users', data)
            .then(() => message.success("Se ha editado exitosamente el usuario"))
            .catch((error) => {
                if (error?.response?.data?.messsage) {
                    return message.error(error?.response?.data?.messsage)
                }
                return message.error("No se ha podido actualizar el usuario, vuelva a intentarlo más tarde")
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
            <UsersForm
                loading={loading}
                onSubmit={saveUsers}
                initialValues={initialValues}
                onCancel={onClose}
            />
        </Modal>
    );
}
export default EditUserModal;
