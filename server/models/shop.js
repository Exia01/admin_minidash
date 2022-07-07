import mongoose from 'mongoose';
// const Schema = mongoose.Schema;
const { Schema } = mongoose;

const ShopSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a shop name'],
      unique: true,
      trim: true,
    },
    memberCode: {
      type: String,
      required: true,
    },
    enrolled: {
      type: Date,
      min: ['2000-01-30', 'Invalid enrolled date'],
      default: Date.now(),
      // max: '1994-05-23'
      message: '{VALUE} is not a supported date',
    },
    phone: {
      type: String,
      // https://stackoverflow.com/questions/18375929/validate-phone-number-using-javascript
      match: [
        /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
        '{VALUE} is not a valid phone number',
      ],
      // message: '{VALUE} is not a valid phone number',
      // required: [true, 'Please provide phone number'],
    },
    ext:{
      type:String
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    zip: {
      type: Number,
    },
    logo: {
      type: String,
      default:
        'https://dummyimage.com/450x450/969696/393e70.png&text=Img-placeholder',
    },
    description: {
      type: String,
      required: false,
    },
    url: {
      type: String,
      // https://stackoverflow.com/questions/8667070/javascript-regular-expression-to-validate-url
      match:
        /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/,
      message: '{VALUE} is not a valid url',
    },
    addedBy: { type: Schema.Types.ObjectId, ref: 'user' },
  },
  {
    timestamps: true,
  }
);

const Shop = mongoose.model('Shop', ShopSchema);

export default Shop;
