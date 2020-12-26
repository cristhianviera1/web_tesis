import React, {FunctionComponent, useState} from "react";
import {message, Modal} from "antd";
import {UsersTable} from "../../../pages/admin/users/Users";
import UsersForm, {UsersValues} from "../../forms/users/users-form";
import {axiosConfig} from "../../_helpers/axiosConfig";

interface NewUsersModalValues {
    visible: boolean,
    initialValues: UsersValues,

    onClose(): void
}

const NewUsersModal: FunctionComponent<NewUsersModalValues> = ({visible, initialValues, onClose}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [users, setUsers] = useState<UsersTable>()

    const saveUser = (data: UsersValues) => {
        console.log(data);
        setLoading(true);
        axiosConfig().post('users', data)
            .then(() => {
                message.success("Se ha creado exitosamente el usuario");
                onClose();
            })
            .catch((error) => {
                if (error?.response?.data?.messsage) {
                    return message.error(error?.response?.data?.messsage)
                }
                return message.error("No se ha podido crear el usuario, vuelva a intentarlo más tarde")
            })
            .finally(() => setLoading(false))
    }

    return (
        <Modal
            title={'Agregar usuario'}
            visible={visible}
            maskClosable={false}
            footer={null}
            centered
            onCancel={onClose}
        >
            <UsersForm
                loading={loading}
                initialValues={initialValues}
                onSubmit={saveUser}
                onCancel={onClose}
            />
        </Modal>
    );
}
export default NewUsersModal;
