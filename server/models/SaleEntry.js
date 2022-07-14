import mongoose from 'mongoose';
// const Schema = mongoose.Schema;
const { Schema } = mongoose;

const SaleEntrySchema = new Schema(
  {
    shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    total: {
      type: Number,
      required: [true, 'Please provide total for sale entry'],
    },
    yearPeriod: {
      type: String,
      required: [true, 'Please provide a year figure'],
    },
    quarter: {
      type: String,
      required: [true, 'Please provide a quarter period'],
    },
    month: {
      type: String,
      required: [true, 'Please provide a month  '],
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


const SaleEntry = mongoose.model('salesEntries', SaleEntrySchema);

export default SaleEntry;
