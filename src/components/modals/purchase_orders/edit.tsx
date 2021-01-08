import React, {FunctionComponent, useState} from "react";
import {message, Modal} from "antd";
import {BranchOfficeTable} from "../../../pages/admin/branch-office/BranchOffice";
import PurchaseOrderForm , {PurchaseOrdersValues} from "../../forms/purchase_orders/purchase-orders-form";
import {axiosConfig} from "../../_helpers/axiosConfig";

interface EditPurchaseOrderModalValues {
    visible: boolean,
    initialValues: PurchaseOrdersValues,

    onClose(): void
}

const EditPurchaseOrderModal: FunctionComponent<EditPurchaseOrderModalValues> = ({visible, initialValues, onClose}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [purchaseOrder, setPurchaseOrder] = useState<BranchOfficeTable>()
    const order = {
        _id: "",
        status: {
            status: ""
        },
        voucher: {
            statuses: {
                status: ""
            }
        }
    }

    const savePurchaseOrder = (data) => {
        order._id = data._id
        order.status.status = data.status
        order.voucher.statuses.status = data.voucher_status
        console.log(order);
        setLoading(true);
        axiosConfig().put('shopping-carts', order)
            .then(() => message.success("Se ha gestionado exitósamente la orden de compra"))
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
