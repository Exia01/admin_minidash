const PORT = process.env.PORT || 5000;
import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import morgan from 'morgan';

import { notFound } from './middleware/not-found.js';
import mongooseErrorHandlerMiddleware from './middleware/mongoose-error-handler.js';
import genericErrorHandler from './middleware/generic-error-handler.js';

import 'dotenv/config'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

import routes from './routes/v1/index.js';

async function mongooseConnect() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('mongoDB connected...');
    app.listen(PORT, () => {
      console.log(`Server listening in port ${PORT}`);
    });
  } catch (err) {
    console.error(`MongoDB connection error: ${err}`);
  }
}

mongooseConnect();
const app = express();
app.use(express.json()); //Used to parse JSON bodies

app.use(morgan('dev'));
// middleware for setting http headers
app.use(helmet());

app.use('/api/v1', routes);
app.use(mongooseErrorHandlerMiddleware)
app.use(genericErrorHandler)
app.use(notFound);


//Example of how to import modules on express
// export function add(a, b) {
//     return a + b;
// }

// import {add, subtract} from './util.mjs'
