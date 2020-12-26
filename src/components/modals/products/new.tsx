import React, {FunctionComponent, useState} from "react";
import {message, Modal} from "antd";
import {ProductsTable} from "../../../pages/admin/products/Products";
import ProductsForm, {ProductsValues} from "../../forms/products/products-form";
import {axiosConfig} from "../../_helpers/axiosConfig";

interface NewProductsModalValues {
    visible: boolean,
    initialValues: ProductsValues,

    onClose(): void
}

const NewProductsModal: FunctionComponent<NewProductsModalValues> = ({visible, initialValues, onClose}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [products, setProduct] = useState<ProductsTable>()

    const saveNewness = (data: ProductsValues) => {
        setLoading(true);
        axiosConfig().post('products', data)
            .then(() => {
                message.success("Se ha creado exitósamente el producto")
                onClose();
            })
            .catch((error) => {
                if (error?.response?.data?.messsage) {
                    return message.error(error?.response?.data?.messsage)
                }
                console.log(error)
                return message.error("No se ha podido crear el producto, vuelva a intentarlo más tarde")
            })
            .finally(() => {
                setLoading(false)
            })
    }

    return (
        <Modal
            title={'Agregar producto'}
            visible={visible}
            maskClosable={false}
            footer={null}
            onCancel={onClose}
        >
            <ProductsForm
                loading={loading}
                initialValues={initialValues}
                onSubmit={saveNewness}
                onCancel={onClose}
            />
        </Modal>
    );
}
export default NewProductsModal;
