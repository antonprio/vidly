module.exports = function (handler) {
    return async (req, res, next) => {
        try {
            //Do Some Logic here
            await handler(req, res);
        } 
        catch (ex) {
            next(ex);
        }
    }
};