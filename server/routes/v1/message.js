import express from 'express';
import { getPublicMessage } from '../../services/messages/api-test-messages.js';


const router = express.Router();

// const msg = '';
// router.get('/public-message', (req, res) => {
//   // const message = getPublicMessage();
//   res.status(200).send({ msg: message });
// });

// const publicMessage =

router.get('/public', (req, res) => {
  const msg = getPublicMessage();
  res.status(200).send({ msg });
});

export default router;
