import mongoose from 'mongoose';
// const Schema = mongoose.Schema;
const { Schema } = mongoose;

const ProductSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      //description
      type: String,
      required: true,
    },
    category: {
      type: String,
      //could also make it several
      //type:Array
    },
    img: {
      type: String,
      default: 'https://www.freeiconspng.com/uploads/no-image-icon-4.png',
    },
    // listed: {
    //   type: Boolean,
    // },
    // inStock: {
    //   type: Boolean,
    // },
    // price: {
    //   type: Number,
    // },
    addedBy: { type: Schema.Types.ObjectId, ref: 'user' },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', ProductSchema);

export default Product;
