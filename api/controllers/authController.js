import * as authService from '../services/authService.js';

const isProduction = process.env.NODE_ENV === 'production';
const REFRESH_TOKEN_COOKIE_NAME = 'refresh_token';
const CSRF_TOKEN_COOKIE_NAME = 'csrf-token';

const REFRESH_TOKEN_EXPIRES_IN_MS = parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN_MS, 10) || 7 * 24 * 60 * 60 * 1000; // 7 dias

const getRefreshTokenCookieOptions = () => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: 'strict',
  path: '/',
  maxAge: REFRESH_TOKEN_EXPIRES_IN_MS,
});

const getCsrfCookieOptions = () => ({
  secure: isProduction,
  sameSite: 'strict',
  path: '/',
  maxAge: REFRESH_TOKEN_EXPIRES_IN_MS,
});

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken, csrfToken, user } = await authService.loginUser(email, password);

    res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, getRefreshTokenCookieOptions());
    res.cookie(CSRF_TOKEN_COOKIE_NAME, csrfToken, getCsrfCookieOptions());

    res.status(200).json({
      status: 'success',
      accessToken,
      user,
    });
  } catch (error) {
    next(error);
  }
}

export const refresh = async (req, res, next) => {
  try {
    const tokenFromCookie = req.cookies[REFRESH_TOKEN_COOKIE_NAME];
    const { accessToken, refreshToken, csrfToken } = await authService.refreshAccessToken(tokenFromCookie);

    res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, getRefreshTokenCookieOptions());
    res.cookie(CSRF_TOKEN_COOKIE_NAME, csrfToken, getCsrfCookieOptions());

    res.status(200).json({
      status: 'success',
      accessToken,
    });
  } catch (error) {
    const { maxAge, ...clearOptions } = getRefreshTokenCookieOptions();
    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, clearOptions);
    res.clearCookie(CSRF_TOKEN_COOKIE_NAME, { ...clearOptions, httpOnly: false });
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const tokenFromCookie = req.cookies[REFRESH_TOKEN_COOKIE_NAME];
    if (tokenFromCookie) {
      await authService.logoutUser(tokenFromCookie);
    }

    const { maxAge, ...clearOptions } = getRefreshTokenCookieOptions();
    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, clearOptions);
    res.clearCookie(CSRF_TOKEN_COOKIE_NAME, { ...clearOptions, httpOnly: false });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export const getMe = (req, res) => {
  if (!req.user) {
    return res.status(404).json({
      status: 'fail',
      message: 'Usuário não encontrado.'
    });
  }
  res.status(200).json({
    status: 'success',
    user: req.user,
  });
}