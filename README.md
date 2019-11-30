# Spotify Data Visualizer (Backend)

Express server on Node runtime to faciliate requests from the Spotify data visualizer client: [top-spotify-web](https://github.com/scjohnson16/top-spotify-web)

* Establishes a socket connection to client via `socket.io` and `session` for seamless OAuth2 transactions
* Encapsulated authentication via `passport`
* Route code separated from server code
* Security middleware: `cors`, `helmet`
* Polls Spotify's API asynchronously
* ES6 syntax; airbnb code style