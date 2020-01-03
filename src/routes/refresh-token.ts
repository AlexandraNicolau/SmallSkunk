import request from 'request';
import { Request, Response } from 'express';
import { HTTP_SUCCESS_CODE, SPOTIFY_API_TOKEN_URL } from '../constants';

const {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
} = process.env;

const route = (req: Request, res: Response) => {
  const bufferString = `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`;
  /* eslint-disable @typescript-eslint/camelcase */
  const { refresh_token } = req.query;
  const authOptions = {
    url: SPOTIFY_API_TOKEN_URL,
    headers: { Authorization: `Basic ${Buffer.from(bufferString).toString('base64')}` },
    form: {
      grant_type: 'refresh_token',
      refresh_token,
    },
    json: true,
  };

  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === HTTP_SUCCESS_CODE) {
      /* eslint-disable @typescript-eslint/camelcase */
      const { access_token } = body;
      res.send({
        access_token,
      });
    }
  });
};

export default route;
