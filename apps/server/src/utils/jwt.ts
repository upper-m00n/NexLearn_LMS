import jwt from 'jsonwebtoken';

interface UserPayload {
  id: string;
  role: string;
}

export const generateToken = (user: UserPayload) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );
};
