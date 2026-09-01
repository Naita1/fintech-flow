import * as authService from '../services/authService.js';

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const data = await authService.loginUser(email, password);
    res.status(200).json(data);
  } catch (error) {
    error.statusCode = 401;
    next(error);
  }
}

export function getMe(req, res) {
  const { id, name, email } = req.user;
  res.status(200).json({ id, name, email });
}