import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';

import loginRoute from './routes/login';
import callbackRoute from './routes/callback';
import refreshTokenRoute from './routes/refresh-token';

const {
  SPOTIFY_TOKEN,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REDIRECT_URI
} = process.env;

if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REDIRECT_URI || !SPOTIFY_TOKEN) {
  console.error('Please ensure you have the correct environment variables setup!');
  process.exit(1);
}
const app = express();

const staticPath = path.join(__dirname, '../public/');

app.use(express.static(staticPath))
  .use(cors())
  .use(cookieParser());

app.get('/', (req, res) => res.redirect('/index.html'));
app.get('/login', loginRoute);
app.get('/callback', callbackRoute);
app.get('/refresh_token', refreshTokenRoute);

console.log('Listening on 8888');
app.listen(8888); 
