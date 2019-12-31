import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import loginRoute from './routes/login';
import callbackRoute from './routes/callback';

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

app.use(express.static(__dirname + '../public'))
   .use(cors())
   .use(cookieParser());

app.get('/login', loginRoute);
app.post('/callback', callbackRoute);

console.log('Listening on 8888');
app.listen(8888); 

// app.get('/refresh_token', function(req, res) {

//   // requesting access token from refresh token
//   var refresh_token = req.query.refresh_token;
//   var authOptions = {
//     url: 'https://accounts.spotify.com/api/token',
//     headers: { 'Authorization': 'Basic ' + (new Buffer(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64')) },
//     form: {
//       grant_type: 'refresh_token',
//       refresh_token: refresh_token
//     },
//     json: true
//   };

//   request.post(authOptions, function(error, response, body) {
//     if (!error && response.statusCode === 200) {
//       var access_token = body.access_token;
//       res.send({
//         'access_token': access_token
//       });
//     }
//   });
// });
