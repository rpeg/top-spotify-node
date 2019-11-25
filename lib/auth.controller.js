exports.spotify = (req, res) => {
  const io = req.app.get("io");

  const user = {
    id: req.user.id,
    image: req.user.photos[0]
  };
  
  io.in(req.session.socketId).emit('spotifyUser', user);
};
