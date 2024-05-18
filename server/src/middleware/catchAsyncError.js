const CatchAsyncError = (theFunc) => (req, res) => {
  Promise.resolve(theFunc(req, res)).catch((err) => res.send(err));
};

module.exports = CatchAsyncError;
