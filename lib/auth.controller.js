exports.spotify = (req, res) => {
  const io = req.app.get("io");
  const profile = {
    id: req.profile.id
  };
  io.in(req.session.socketId).emit("spotify", profile);
};
