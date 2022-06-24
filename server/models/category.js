import mongoose from 'mongoose';
// const Schema = mongoose.Schema;
const { Schema } = mongoose;

const CategorySchema = new Schema(
  //only props in this obj will be passed on to db
  {
    name: {
      type: String,
      required: [true, 'Please provide a category name'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
    },
    // products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model('Category', CategorySchema);

export default Category;
