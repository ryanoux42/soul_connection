const connection = require('../../config/db');

//query to check if the db is empty
exports.is_db_empty = () => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM employee', 
        (err, results) => {
          if (err) {
            return reject(err);
          }
          if (results.rowCount == 0) {
            resolve(true);
          } else {
            resolve(false);
          }
        }
      );
    });
  };
