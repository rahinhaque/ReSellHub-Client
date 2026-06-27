import { serverMutation } from "../../server";

export const resolveOrder = async (
  orderId,
  { orderStatus, issueRefundNow },
) => {
  return serverMutation(`/api/admin/orders/${orderId}/resolve`, "PATCH", {
    orderStatus,
    issueRefundNow,
  });
};
