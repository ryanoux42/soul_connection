const connection = require('../../config/db');

//query to update row with the chosen id in the table tip
exports.update_tip_info = (id, title, tip) => {
  return new Promise((resolve, reject) => {
    connection.query('UPDATE tip SET title = $1, tip = $2 WHERE id = $3', [title, tip, id],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        // console.log('tip updated successfully:', results);
        resolve(results);
      }
    );
  });
}

//query to insert new row in the table tip
exports.insert_tip_info = (id, title, tip) => {
  return new Promise((resolve, reject) => {
    connection.query(
      'INSERT INTO tip (id, title, tip) VALUES ($1, $2, $3)',
      [id, title, tip],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        // console.log('tip inserted successfully:', results);
        resolve(results);
      }
    );
  });
}

//query to check if we need to update row with the chosen id in the table tip
exports.need_update_tip = (id) => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM tip WHERE id = $1', [id], 
      (err, results) => {
        if (err) {
          return reject(err);
        }
        // console.log(results.rows[0]["title"]);
        // console.log(results.rowCount);
        if (results.rowCount == 0) {
          resolve(false);
        } else {
          resolve(true);
        }
      }
    );
  });
};

//query to get all info of all tips
exports.get_tip_info = () => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM tip', 
      (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results.rows);
      }
    );
  });
};