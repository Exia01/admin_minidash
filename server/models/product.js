import mongoose from 'mongoose';
// const Schema = mongoose.Schema;
const { Schema } = mongoose;

const ProductSchema = new Schema(
  //only props in this obj will be passed on to db
  {
    name: {
      type: String,
      required: [true, 'Please provide a product title'],
      unique: true,
      trim: true,
    },
    sku: {
      type: Number,
      // required:true,
      // unique:true,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      //description
      type: String,
      required: [true, 'Please provide a product description'],
    },

    // category: { type: Schema.Types.ObjectId, ref: 'Category' },
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
    price: {
      type: Number,
    },
    addedBy: { type: Schema.Types.ObjectId, ref: 'user' },
    // isShipEnabled: {
    //   type: Boolean,
    //   default: true,
    // },
    unitsSold: {
      type: Number,
      default: 0,
    },
    schemaVer: {
      type: Number,
    },
  },

  {
    timestamps: true,
  }
  // {
  //   toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
  //   toObject: { virtuals: true }, // So `console.log()` and other functions that use `toObject()` include virtuals
  // }
);

function convertToSlug(Text) {
  return Text.toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}
// ProductSchema.virtual('categories', {
//   ref: 'Category',
//   localField: '_id',
//   foreignField: 'products',
// });

//Using regular function to scope 'this'
ProductSchema.pre('save', async function () {
  const newSlug = await convertToSlug(this.name);
  this.slug = newSlug;
});

const Product = mongoose.model('Product', ProductSchema);

export default Product;
