import * as authService from '../services/authService.js';

const isProduction = process.env.NODE_ENV === 'production';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  maxAge: 24 * 60 * 60 * 1000,
};

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    
    const { user, token } = await authService.loginUser(email, password);

    res.cookie('token', token, COOKIE_OPTIONS);

    res.status(200).json({ user });
  } catch (error) {
    error.statusCode = 401;
    next(error);
  }
}

export function logout(req, res) {
  res.clearCookie('token', COOKIE_OPTIONS);
  
  res.status(200).json({ message: 'Logout realizado com sucesso.' });
}

export function getMe(req, res) {
  const { id, name, email } = req.user;
  res.status(200).json({ id, name, email });
}