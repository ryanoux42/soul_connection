const connection = require('../../config/db');

//query to insert new row in the table event
exports.insert_event_info = (id, name, date, duration, max_participants, location_x, location_y, type, employee_id, location_name) => {
  return new Promise((resolve, reject) => {
    connection.query(
      'INSERT INTO event (event_id, _name, _date, duration, max_participants, location_x, location_y, _type, employee_id, location_name) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
      [id, name, date, duration, max_participants, location_x, location_y, type, employee_id, location_name],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        // console.log('event inserted successfully:', results);
        resolve(results);
      }
    );
  });
}

//query to update row with the chosen id in the table event
exports.update_event_info = (id, name, date, duration, max_participants, location_x, location_y, type, employee_id, location_name) => {
  return new Promise((resolve, reject) => {
    connection.query(
      'UPDATE event SET _name = $1, _date = $2, duration = $3, max_participants = $4, location_x = $5, location_y = $6, _type = $7, employee_id = $8, location_name = $9 WHERE event_id = $10',
      [name, date, duration, max_participants, location_x, location_y, type, employee_id, location_name, id],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        // console.log('event inserted successfully:', results);
        resolve(results);
      }
    );
  });
}

//query to check if we need to update row with the chosen id in the table event
exports.need_update_event = (id) => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM event WHERE event_id = $1', [id], 
      (err, results) => {
        if (err) {
          return reject(err);
        }
        if (results.rowCount == 0) {
          resolve(false);
        } else {
          resolve(true);
        }
      }
    );
  });
};

//query to get all info of all events created by one employee
exports.get_event_info_by_id = (id) => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM event WHERE employee_id = $1', [id], 
      (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results.rows);
      }
    );
  });
};

//query to get all info of all events
exports.get_event_info = () => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM event', 
      (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results.rows);
      }
    );
  });
};