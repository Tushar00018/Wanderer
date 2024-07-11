//HIGHER VERSION OF TRY AND CATCH METHOD
//SINGLE FUNCTION TO HANDLE THE ERROR
module.exports = (fun) => {
  return (req, res, next) => {
    fun(req, res, next).catch((err) => next(err));
  };
};
