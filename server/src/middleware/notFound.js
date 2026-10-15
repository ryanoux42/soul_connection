const connection = require('../config/db');

exports.check_employee_id = (req, res, next) => {
    const id = req.params.id;

    if (isNaN(id)) {
      return res.status(400).send({ message: 'Invalid employee ID' });
    }
    connection.query('SELECT * FROM employee WHERE user_id = $1', [id], 
      (err, results) => {
        if (err) {
          console.error(err);
        }
        if (results.rowCount == 0) {
          res.status(500).send("Employee Not found");
        } else {
          next();
        }
      }
    );
};

exports.check_customer_id = (req, res, next) => {
  const id = req.params.id;

  if (isNaN(id)) {
    return res.status(400).send({ message: 'Invalid customer ID' });
  }
  connection.query('SELECT * FROM customer WHERE customer_id = $1', [id], 
    (err, results) => {
      if (err) {
        console.error(err);
      }
      if (results.rowCount == 0) {
        res.status(500).send("Customer Not found");
      } else {
        next();
      }
    }
  );
};
