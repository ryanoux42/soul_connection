const connection = require('../../config/db');

exports.is_db_set = () => {
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

exports.is_coach = (user_id) => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT work FROM employee WHERE user_id = $1', [user_id], 
      (err, results) => {
        if (err) {
          return reject(err);
        }
        let user_work = results.rows[0]["work"];
        // console.log(user_work);
        if (user_work == 'Coach') {
          resolve(true);
        } else {
          resolve(false);
        }
      }
    );
  });
};

exports.insert_token = (access_token) => {
    connection.query('INSERT INTO token (token) VALUES ($1)', [access_token],
          (err, results) => {
              // console.log(results);
          }
      );
};