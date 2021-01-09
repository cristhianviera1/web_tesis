import React, {FunctionComponent, useState} from "react";
import {message, Modal} from "antd";
import PurchaseOrderForm, {PurchaseOrdersValues} from "../../forms/purchase_orders/purchase-orders-form";
import {axiosConfig} from "../../_helpers/axiosConfig";

interface EditPurchaseOrderModalValues {
    visible: boolean,
    initialValues: PurchaseOrdersValues,

    onClose(): void
}

const EditPurchaseOrderModal: FunctionComponent<EditPurchaseOrderModalValues> = ({visible, initialValues, onClose}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const savePurchaseOrder = (data) => {
        const form = {
            delivery_status: initialValues.voucher_status !== 'aprobado' ? undefined : data.status,
            status: data.voucher_status,
        };
        setLoading(true);
        axiosConfig().put(`shopping-carts/status/${data._id}`, form)
            .then(({data}) => message.success("Se ha gestionado exitósamente la orden de compra"))
            .catch((error) => {
                if (error?.response?.data?.messsage) {
                    return message.error(error?.response?.data?.messsage)
                }
                return message.error("No se ha podido gestionar la orden de compra, vuelva a intentarlo más tarde")
            })
            .finally(() => {
                setLoading(false)
                onClose();
            })
    }

    return (
        <Modal
            title={'Gestión de orden'}
            visible={visible}
            maskClosable={false}
            footer={null}
            onCancel={onClose}
        >
            <PurchaseOrderForm
                loading={loading}
                onSubmit={savePurchaseOrder}
                initialValues={initialValues}
                onCancel={onClose}
            />
        </Modal>
    );
}
export default EditPurchaseOrderModal;
