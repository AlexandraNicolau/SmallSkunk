import { Request, Response } from 'express';
import querystring from 'querystring';
import request from 'request';
import { STATE_KEY, SPOTIFY_API_TOKEN } from '../constants';

const {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REDIRECT_URI,
} = process.env;
const route = (req: Request, res: Response) => {
  // your application requests refresh and access tokens
  // after checking the state parameter

  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[STATE_KEY] : null;

  if (state === null || state !== storedState) {
    const mismatch = querystring.stringify({ error: 'state_mismatch' });
    res.redirect(`/#${mismatch}`);
  } else {
    res.clearCookie(STATE_KEY);
    const authStr = `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`;
    const authBuffer = Buffer.from(authStr).toString('base64');
    const authOptions = {
      url: SPOTIFY_API_TOKEN,
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
      if (!error && response.statusCode === 200) {
        /* eslint-disable camelcase */

        const { access_token: accessToken, refresh_token: refreshToken } = body;
        // const options = {
        //   url: SPOTIFY_REFRESH_TOKEN,
        //   headers: { Authorization: `Bearer ${access_token}` },
        //   json: true,
        // };

        // use the access token to access the Spotify Web API
        // request.get(options, (err, res, refreshTokenBody) => {});
        // we can also pass the token to the browser to make requests from there
        const token = querystring.stringify({
          accessToken,
          refreshToken,
        });
        res.redirect(`/#${token}`);
      } else {
        const invalidToken = querystring.stringify({ error: 'invalid_token' });
        res.redirect(`/#${invalidToken}`);
      }
    });
  }
};

export default route;
