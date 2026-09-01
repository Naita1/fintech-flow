import * as authService from '../services/authService.js';

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    
    const { user, token } = await authService.loginUser(email, password);

    res.cookie('token', token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', 
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ user });
  } catch (error) {
    error.statusCode = 401;
    next(error);
  }
}

export function logout(req, res) {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  
  res.status(200).json({ message: 'Logout realizado com sucesso.' });
}

export function getMe(req, res) {
  const { id, name, email } = req.user;
  res.status(200).json({ id, name, email });
}