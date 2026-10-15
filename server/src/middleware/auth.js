const connection = require('../config/db');

exports.check_token = (req, res, next) => {
    const token = req.headers['token'];

    if (token) {
        connection.query('SELECT * FROM token WHERE token = $1', [token], 
            (err, results) => {
                if (results.rowCount == 0) {
                    res.status(500).send("Token is not valid");
                } else {
                    next();
                }
            }
        );
    } else {
        res.status(500).send("No token, authorization denied");
    }
}
