import { networkInterfaces } from 'os';

export default function handler(req, res) {
  const nets = networkInterfaces();
  let ip = 'localhost';

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (net.family === 'IPv4' && !net.internal) {
        ip = net.address;
        break;
      }
    }
    if (ip !== 'localhost') break;
  }

  res.status(200).json({ 
    ip, 
    port: process.env.PORT || 3000,
    url: `http://${ip}:${process.env.PORT || 3000}`,
    mode: process.env.VERCEL ? 'cloud' : 'local'
  });
}
