import * as authService from '../services/authService.js';
import AppError from '../utils/AppError.js';

const isProduction = process.env.NODE_ENV === 'production';

export const COOKIE_NAME = 'token';

export const getAuthCookieOptions = () => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  path: '/',
  maxAge: 24 * 60 * 60 * 1000,
});

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    console.log('[LOGIN DEBUG] Campos recebidos:', {
      emailIsString: typeof email === 'string',
      passwordIsString: typeof password === 'string',
      emailHasOuterWhitespace: typeof email === 'string' && email !== email.trim(),
      emailHasUppercase: typeof email === 'string' && email !== email.toLowerCase(),
    });

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return next(new AppError('E-mail e senha são obrigatórios e devem ser válidos.', 400));
    }

    if (!process.env.JWT_SECRET || !process.env.DATABASE_URL) {
      throw new Error('JWT_SECRET ou DATABASE_URL não está configurada.');
    }

    const sanitizedEmail = email.trim().toLowerCase();
    console.log('[LOGIN DEBUG] E-mail enviado à consulta foi normalizado com trim().toLowerCase().');
    const { user, token } = await authService.loginUser(sanitizedEmail, password);

    const cookieOptions = getAuthCookieOptions();
    res.cookie(COOKIE_NAME, token, cookieOptions);

    res.status(200).json({ user });
  } catch (error) {
    console.error('ERRO DETALHADO NO LOGIN:', error);

    if (error instanceof AppError && error.statusCode < 500) {
      return next(error);
    }

    return res.status(500).json({ message: 'Erro interno ao realizar login' });
  }
}

export async function logout(req, res, next) {
  try {
    const { maxAge, ...clearOptions } = getAuthCookieOptions();
    res.clearCookie(COOKIE_NAME, clearOptions);

    res.status(200).json({ message: 'Logout realizado com sucesso.' });
  } catch (error) {
    next(error);
  }
}

export function getMe(req, res) {
  const { id, name, email } = req.user;
  res.status(200).json({ id, name, email });
}