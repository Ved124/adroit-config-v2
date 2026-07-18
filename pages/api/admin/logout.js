import { serialize } from 'cookie';

export default function handler(req, res) {
  // Clear the cookie by setting maxAge to 0
  const serializedCookie = serialize('admin_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });

  res.setHeader('Set-Cookie', serializedCookie);
  return res.redirect('/admin/login');
}
