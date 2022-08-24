import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const createToken = (user) => {
  // Sign the JWT
  //   if (!user.role) {
  //     throw new Error('No user role specified');
  //   }
  return jwt.sign(
    {
      sub: user._id, //subject || known as id
      // user: user,
      email: user.email,
      role: user.role,
      iss: '', //issuer
      aud: '', //audience,
    },
    process.env.JWT_SECRET,
    { algorithm: 'HS256', expiresIn: '1h' }
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const verifyPassword = (passwordAttempt, hashedPassword) => {
  return bcrypt.compare(passwordAttempt, hashedPassword);
};
async function hashPassword(stringWord) {
  const saltRounds = 10;
  const generatedSalt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(stringWord, generatedSalt);
  return hashedPassword;
}
export { createToken, verifyToken, verifyPassword, hashPassword };
