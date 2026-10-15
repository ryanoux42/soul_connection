const connection = require('../../config/db');

//query to get list of customer_id link to one coach by using his id
exports.get_customer_coach = (coach_id) => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT customer_id FROM link_customer_coach WHERE coach_id = $1', [coach_id], 
      (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results.rows);
      }
    );
  });
};

//query to get all info of all employees where work is coach info
exports.get_coach_info = () => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM employee WHERE work = $1', ['Coach'], 
      (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results.rows);
      }
    );
  });
};

//query to get all info of all employees
exports.get_employee_info = () => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM employee', 
      (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results.rows);
      }
    );
  });
};


//query to get the id max in the table employee
exports.get_max_id_employee = () => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT max(user_id) FROM employee', 
      (err, results) => {
        if (err) {
          return reject(err);
        }
        let new_id = results.rows[0]["max"];
        // console.log(new_id);
        resolve(new_id);
      }
    );
  });
};

//query to get all info of one employee by using his id
exports.get_employee_info_by_id = (id) => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM employee WHERE user_id = $1', [id], 
      (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results.rows);
      }
    );
  });
};

//query to check if we need to update row with the chosen id in the table employee
exports.need_update_employee = (id) => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM employee WHERE user_id = $1', [id], 
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

//query to update row in the table empolyee
exports.update_employee_info = (user_id, email, firstname, lastname, gender, birth_date, work) => {
  return new Promise((resolve, reject) => {
    connection.query(
      'UPDATE employee SET email = $1, firstname = $2, lastname = $3, gender = $4, birth_date = $5, work  = $6 WHERE user_id = $7',
      [email, firstname, lastname, gender, birth_date, work, user_id],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        // console.log('Employee info inserted successfully:', results);
        resolve(results);
      }
    );
  });
}

//query to insert new row in the table employee
exports.insert_employee_info = (user_id, email, firstname, lastname, gender, birth_date, work) => {
  return new Promise((resolve, reject) => {
    connection.query(
      'INSERT INTO employee (user_id, email, firstname, lastname, gender, birth_date, work) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [user_id, email, firstname, lastname, gender, birth_date, work],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        // console.log('Employee info inserted successfully:', results);
        resolve(results);
      }
    );
  });
}
