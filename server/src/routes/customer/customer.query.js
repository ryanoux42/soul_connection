const connection = require('../../config/db');

//query to get all id, firstname, lastname of all customers
exports.get_customer_name_info = () => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT customer_id, firstname, lastname FROM customer', 
      (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results.rows);
      }
    );
  });
};

//query to get all info of all clothes
exports.get_customer_clothe_info = () => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM clothe', 
      (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results.rows);
      }
    );
  });
};

//query to get all info of all clothes by the type of clothe
exports.get_customer_clothe_info_by_type = (type) => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM clothe WHERE _type = $1', [type], 
      (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results.rows);
      }
    );
  });
};

//query to get all info of all clothes by the type of clothe
exports.get_customer_clothe_info_by_id = (id) => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM clothe WHERE customer_id = $1', [id], 
      (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results.rows);
      }
    );
  });
};

//query to get all info of all clothes by the type of clothe and customer_id
exports.get_customer_clothe_info_by_id_type = (id, type) => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM clothe WHERE customer_id = $1 AND _type = $2', [id, type], 
      (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results.rows);
      }
    );
  });
};

//query to get all id, firstname, lastname, astrological sign of all customers
exports.get_customer_astro_info = () => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT customer_id, firstname, lastname, astro_sign FROM customer', 
      (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results.rows);
      }
    );
  });
};

//query to get all info of one customer by using his id
exports.get_customer_info_by_id = (customer_id) => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM customer WHERE customer_id = $1', [customer_id], 
      (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results.rows);
      }
    );
  });
};

//query to check if we need to update row with the chosen id in the table payement
exports.need_update_customer_payement = (id) => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM payement WHERE payement_id = $1', [id], 
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

//query to update row in the table payement
exports.update_customer_payement_info = (customer_id, payement_id, date, payment_method, amount, comment) => {
  return new Promise((resolve, reject) => {
    connection.query(
      'UPDATE payement SET customer_id = $1, _date = $2, payment_method = $3, amount = $4, comment = $5 WHERE payement_id = $6',
      [customer_id, date, payment_method, amount, comment, payement_id],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        // console.log('Customer payement info inserted successfully:', results);
        resolve(results);
      }
    );
  });
}

//query to get all payements info of one customer by using his id
exports.get_customer_payement_info_by_id = (customer_id) => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM payement WHERE customer_id = $1', [customer_id],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results.rows);
      }
    );
  });
};

//query to check if we need to update row with the chosen id in the table encounter
exports.need_update_customer_encounter = (id) => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM encounter WHERE encounter_id = $1', [id], 
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

//query to update row in the table encounter
exports.update_customer_encounter_info = (customer_id, encounter_id, date, rating, comment, source) => {
  return new Promise((resolve, reject) => {
    connection.query(
      'UPDATE encounter SET customer_id = $1, _date = $2, rating = $3, source = $4, comment = $5 WHERE encounter_id = $6',
      [customer_id, date, rating, source, comment, encounter_id],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        // console.log('Customer encounter info inserted successfully:', results);
        resolve(results);
      }
    );
  });
}

//query to get all meetings info of one customer by using his id
exports.get_customer_encounter_info_by_id = (customer_id) => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM encounter WHERE customer_id = $1', [customer_id],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results.rows);
      }
    );
  });
};

//query to get all payements info
exports.get_customer_payement_info = () => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM payement ORDER BY _date', 
      (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results.rows);
      }
    );
  });
};

//query to get all encounters info
exports.get_customer_encounter_info = () => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM encounter ORDER BY _date', 
      (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results.rows);
      }
    );
  });
};

//query to get all encounters info
exports.get_list_source = () => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT DISTINCT source FROM encounter', 
      (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results.rows);
      }
    );
  });
};

//query to get all customers info
exports.get_customer_info = () => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM customer', 
      (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results.rows);
      }
    );
  });
};

//query to check if we need to update row with the chosen id in the table customer
exports.need_update_customer = (id) => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM customer WHERE customer_id = $1', [id], 
      (err, results) => {
        if (err) {
          return reject(err);
        }
        if (results.length == 0) {
          resolve(false);
        } else {
          resolve(true);
        }
      }
    );
  });
};

//query to update row in the table customer
exports.update_customer_info = (customer_id, email, firstname, lastname, gender, birth_date, descr, astro_sign, phone_number, address) => {
  return new Promise((resolve, reject) => {
    connection.query(
      'UPDATE customer SET email = $1, firstname = $2, lastname = $3, gender = $4, birth_date = $5, descr = $6, astro_sign = $7, phone_number = $8, _address = $9 WHERE customer_id = $10',
      [email, firstname, lastname, gender, birth_date, descr, astro_sign, phone_number, address, customer_id],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        // console.log('Customer info inserted successfully:', results);
        resolve(results);
      }
    );
  });
}

//query to check if we need to update row with the chosen id in the table clothe
exports.need_update_clothe = (id) => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM clothe WHERE clothe_id = $1', [id], 
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

//query to insert new row in the table clothe
exports.insert_customer_clothe_info = (customer_id, clothe_id, type) => {
  return new Promise((resolve, reject) => {
    connection.query(
      'INSERT INTO clothe (customer_id, clothe_id, _type) VALUES ($1, $2, $3)', [customer_id, clothe_id, type],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        // console.log('Customer info inserted successfully:', results);
        resolve(results);
      }
    );
  });
}

//query to update row in the table clothe
exports.update_customer_clothe_info = (customer_id, clothe_id, type) => {
  return new Promise((resolve, reject) => {
    connection.query(
      'UPDATE clothe SET customer_id = $1, _type = $2 WHERE clothe_id = $3', [customer_id, type, clothe_id],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        // console.log('Customer info inserted successfully:', results);
        resolve(results);
      }
    );
  });
}

//query to insert new row in the table customer
exports.insert_customer_info = (customer_id, email, firstname, lastname, gender, birth_date, descr, astro_sign, phone_number, address) => {
  return new Promise((resolve, reject) => {
    connection.query(
      'INSERT INTO customer (customer_id, email, firstname, lastname, gender, birth_date, descr, astro_sign, phone_number, _address) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
      [customer_id, email, firstname, lastname, gender, birth_date, descr, astro_sign, phone_number, address],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        // console.log('Customer info inserted successfully:', results);
        resolve(results);
      }
    );
  });
}

//query to insert new row in the table payement
exports.insert_customer_payement_info = (customer_id, payement_id, date, payment_method, amount, comment) => {
  return new Promise((resolve, reject) => {
    connection.query(
      'INSERT INTO payement (payement_id, customer_id, _date, payment_method, amount, comment) VALUES ($1, $2, $3, $4, $5, $6)',
      [payement_id, customer_id, date, payment_method, amount, comment],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        // console.log('Customer payement info inserted successfully:', results);
        resolve(results);
      }
    );
  });
}

//query to insert new row in the table encounter
exports.insert_customer_encounter_info = (customer_id, encounter_id, date, rating, comment, source) => {
  return new Promise((resolve, reject) => {
    connection.query(
      'INSERT INTO encounter (encounter_id, customer_id, _date, rating, source, comment) VALUES ($1, $2, $3, $4, $5, $6)',
      [encounter_id, customer_id, date, rating, source, comment],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        // console.log('Customer encounter info inserted successfully:', results);
        resolve(results);
      }
    );
  });
}

//query to insert new row in the table link_customer_coach
exports.link_client_to_coach = (customer_id, coach_id) => {
  connection.query('INSERT INTO link_customer_coach (coach_id, customer_id) VALUES ($1, $2)', [coach_id, customer_id],
      (err, results) => {
        // console.log(results);
      }
  );
};

//query to delete all row in the table link_customer_coach of one coach
exports.unlink_all_client_to_coach = (coach_id) => {
  connection.query('DELETE FROM link_customer_coach WHERE coach_id = $1', [coach_id],
      (err, results) => {
        // console.log(results);
      }
  );
};

//query to delete row in the table link_customer_coach
exports.unlink_client_to_coach = (customer_id, coach_id) => {
  connection.query('DELETE FROM link_customer_coach WHERE coach_id = $1 AND customer_id = $2', [coach_id, customer_id],
      (err, results) => {
        // console.log(results);
      }
  );
};
