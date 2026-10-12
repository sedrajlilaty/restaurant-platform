import { z } from "zod"
import { phone, requiredText } from "@/lib/validation"

export const checkoutSchema = z
  .object({
    orderType: z.enum(["dine_in", "takeaway", "delivery"]),
    customerName: requiredText(60),
    customerPhone: phone,
    deliveryAddress: z.string().trim().max(200, "validation.tooLong"),
    paymentMethod: z.enum(["cash", "shamcash"]),
    note: z.string().trim().max(300, "validation.tooLong"),
  })
  .superRefine((values, ctx) => {
    if (values.orderType === "delivery" && values.deliveryAddress.length < 5) {
      ctx.addIssue({ code: "custom", path: ["deliveryAddress"], message: "validation.addressRequired" })
    }
  })

export type CheckoutValues = z.infer<typeof checkoutSchema>