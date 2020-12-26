import React, {FunctionComponent, useState} from "react";
import {message, Modal} from "antd";
import {ProductsTable} from "../../../pages/admin/products/Products";
import ProductsForm, {ProductsValues} from "../../forms/products/products-form";
import {axiosConfig} from "../../_helpers/axiosConfig";

interface EditProductModalValues {
    visible: boolean,
    initialValues: ProductsValues,

    onClose(): void
}

const EditProductModal: FunctionComponent<EditProductModalValues> = ({visible, initialValues, onClose}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [products, setProduct] = useState<ProductsTable>()

    const saveProduct = (data: ProductsValues) => {
        setLoading(true);
        axiosConfig().put('products', data)
            .then(() => {
                message.success("Se ha editado exitósamente el producto");
                onClose();
            })
            .catch((error) => {
                if (error?.response?.data?.messsage) {
                    return message.error(error?.response?.data?.messsage)
                }
                return message.error("No se ha podido actualizar el producto, vuelva a intentarlo más tarde")
            })
            .finally(() => setLoading(false))
    }

    return (
        <Modal
            title={'Editar producto'}
            visible={visible}
            maskClosable={false}
            footer={null}
            onCancel={onClose}
        >
            <ProductsForm
                loading={loading}
                onSubmit={saveProduct}
                initialValues={initialValues}
                onCancel={onClose}
            />
        </Modal>
    );
}
export default EditProductModal;
