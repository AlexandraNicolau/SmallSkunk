import request from 'request';
import http from 'http';

const {
  SPOTIFY_TOKEN,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
} = process.env;

http.createServer((request, response) => {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.write('Hello World');
  response.end();
}).listen(8888);

// const options = {
//   url: 'https://api.spotify.com/v1/me/player/currently-playing',
//   headers: { 'Authorization': 'Bearer ' + SPOTIFY_TOKEN },
//   json: true
// };

// use the access token to access the Spotify Web API
// request.get(options, function(error, response, body) {
//   console.log(body);
// });
