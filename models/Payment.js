import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    history:[{
      paymentId: {
        type: String,
      },
      amount: {
        type: Number,
      },
      planPrice:{
        type:Number,
      },
      orderId: {
        type: String,
      }, 
      coupon: {
        data: [
          {
            type: String,
          },
        ],
        discount: {
          type: Number,
        },
      },
      college: {
        name: String,
        code: String,
      },
      email: String,
      phone: String,
      address: {
        country: String,
        postal: String,
      },
      category:String,
      plan: String,
      modules: {
        type: [String],
      },
      expiryDate: {
        type: Date,
      },
    }],
    orderId: {
      type: String,
    }, 
    standardTemplate:{
      type:String,
      default:""
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.payments || mongoose.model("payments", paymentSchema);
