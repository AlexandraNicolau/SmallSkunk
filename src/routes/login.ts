import querystring from 'querystring';
import { Request, Response } from 'express';

import { STATE_KEY, SCOPE, SPOTIFY_AUTH_URL } from '../constants';
import generateRandomString from '../helpers/generate-random-string';

const {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_REDIRECT_URI,
} = process.env;

const route = (req: Request, res: Response) => {
  const state = generateRandomString(16);
  const authParams = querystring.stringify({
    response_type: 'code',
    client_id: SPOTIFY_CLIENT_ID,
    scope: SCOPE,
    redirect_uri: SPOTIFY_REDIRECT_URI,
    state,
  });
  res.cookie(STATE_KEY, state);
  res.redirect(`${SPOTIFY_AUTH_URL}${authParams}`);
};

export default route;
