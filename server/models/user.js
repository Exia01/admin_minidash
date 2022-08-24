// https://medium.com/geekculture/how-i-built-an-e-commerce-api-with-nodejs-express-and-mongodb-part-3-60150d354587
import { mongoose } from 'mongoose';
import bcrypt from 'bcrypt';

const Schema = mongoose.Schema;

const UserSchema = Schema(
  {
    username: {
      type: String,
      //   required: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide email address'],
      match: [
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Invalid email format',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      trim: true,
      uppercase: true,
      required: true,
      minLength: [5, 'Password must be at least five characters'],
    },
    role: {
      type: String,
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

async function hashPassword(stringWord) {
  console.log(stringWord, 'inside hashPassword function');
  const saltRounds = 10;
  const generatedSalt = await bcrypt.genSalt(saltRounds);
  console.log(generatedSalt);
  const hashedPassword = await bcrypt.hash(stringWord, generatedSalt);
  return hashedPassword;
}
UserSchema.pre('save', async function () {
  //could probably eliminate the async and await block here and just do a try-catch?
  const hashedPass = await hashPassword(this.password);
  this.password = hashedPass;
});

const User = mongoose.model('User', UserSchema);

export default User;
