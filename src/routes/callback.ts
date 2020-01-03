import { Request, Response } from 'express';
import querystring from 'querystring';
import request from 'request';
import { STATE_KEY, SPOTIFY_API_TOKEN_URL, HTTP_SUCCESS_CODE } from '../constants';

const {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REDIRECT_URI,
} = process.env;

const route = (req: Request, res: Response) => {
  console.info('Callback route hit');

  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[STATE_KEY] : null;

  if (state === null || state !== storedState) {
    const mismatch = querystring.stringify({ error: 'state_mismatch' });
    console.info('Redirecting to /#mismatch');
    res.redirect(`/#${mismatch}`);
  } else {
    res.clearCookie(STATE_KEY);
    const authStr = `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`;
    const authBuffer = Buffer.from(authStr).toString('base64');
    const authOptions = {
      url: SPOTIFY_API_TOKEN_URL,
      form: {
        code,
        redirect_uri: SPOTIFY_REDIRECT_URI,
        grant_type: 'authorization_code',
      },
      headers: {
        Authorization: `Basic ${authBuffer}`,
      },
      json: true,
    };

    request.post(authOptions, (error, response, body) => {
      if (!error && response.statusCode === HTTP_SUCCESS_CODE) {
        /* eslint-disable @typescript-eslint/camelcase */
        const { access_token, refresh_token } = body;
        const token = querystring.stringify({
          access_token,
          refresh_token,
        });
        console.info('Redirecting to /#token');
        res.redirect(`/#${token}`);
      } else {
        const invalidToken = querystring.stringify({ error: 'invalid_token' });
        console.info('Redirecting to /#invalid_token');
        res.redirect(`/#${invalidToken}`);
      }
    });
  }
};

export default route;
