var axios = require('axios');
const {insert_employee_info, get_employee_info, get_coach_info, get_customer_coach, get_max_id_employee,
  need_update_employee, update_employee_info, get_employee_info_by_id} = require('./employee.query');
const {get_customer_encounter_info_by_id, get_customer_info_by_id} = require('../customer/customer.query');
var express = require('express');
var router = express.Router();
const fs = require('fs');
const axiosRetry = require('axios-retry').default;
const {check_employee_id} = require('../../middleware/notFound');
const {check_token} = require('../../middleware/auth');

axiosRetry(axios, {
  retries: 3,
  retryDelay: (retryCount) => {
      console.log(`retry attempt: ${retryCount}`);
      return retryCount * 2000;
  },
  retryCondition: (error) => {
      return error.response.status >= 500;
  },
});

//download image employee
async function download_employee_image(employee_id, name, surname, access_token) {
  try {
    let employee_image = await axios.get(`https://soul-connection.fr/api/employees/${employee_id}/image`, {
      headers: {
        'X-Group-Authorization': process.env.API_KEY_VALUE,
        'Authorization': `Bearer ${access_token}`,
        'accept': 'image/png'
      },
      responseType: 'arraybuffer'
    });
    fs.appendFile(`../client/public/image/employee/${employee_id}_${name}_${surname}.png`, Buffer.from(employee_image.data),
      (err) => {
        if (err) {
          // console.error('download_employee_image err:', err);;
        }
        // console.log(`employee ${employee_id} image done`);
    });
  } catch (error) {
    if (error.status) {
      console.error(`download_employee_image err: ${error.status} ${error.config["url"]}`);
    } else {
      console.error(`pb api download_employee_image err: ${error}`);
    }
  }
}

//add or update row in table employee
async function migrate_employee_info(employee_id, access_token, is_db_empty) {
  try {
    let employee = await axios.get(`https://soul-connection.fr/api/employees/${employee_id}`, {
      headers: {
        'X-Group-Authorization': process.env.API_KEY_VALUE,
        'Authorization': `Bearer ${access_token}`
      }
    })
    let employeeData = employee.data;
    // console.log(employeeData);
    if (is_db_empty) {
      await insert_employee_info(employeeData["id"], employeeData["email"], employeeData["name"],
      employeeData["surname"], employeeData["gender"], employeeData["birth_date"],
      employeeData["work"]);
    } else {
      let update = await need_update_employee(employeeData["id"]);
      if (update) {
        update_employee_info(employeeData["id"], employeeData["email"], employeeData["name"],
        employeeData["surname"], employeeData["gender"], employeeData["birth_date"],
        employeeData["work"]);
      } else {
        await insert_employee_info(employeeData["id"], employeeData["email"], employeeData["name"],
        employeeData["surname"], employeeData["gender"], employeeData["birth_date"],
        employeeData["work"]);
      }
    }
    download_employee_image(employeeData["id"], employeeData["name"], employeeData["surname"],
    access_token);
  } catch (error) {
    if (error.status) {
      console.error(`migrate_employee err: ${error.status} ${error.config["url"]}`);
    } else {
      console.error(`pb api migrate_employee err: ${error}`);
    }
  }
}

//fill or update table employee
async function fill_employee_table(access_token, is_db_empty) {
  try {
    let employees = await axios.get('https://soul-connection.fr/api/employees', {
      headers: {
        'X-Group-Authorization': process.env.API_KEY_VALUE,
        'Authorization': `Bearer ${access_token}`
      }
    })
    let employeesData = employees.data;
    // for (let i = 0; i < 1; i++) {
    for (let i = 0; i < employeesData.length; i++) {
      migrate_employee_info(employeesData[i].id, access_token, is_db_empty);
    }
    console.log("Fill employee table");
  } catch (error) {
    console.error('get employee err:', error);
  }
}

//request GET to access image of one employee
router.get('/:id/image', check_token, check_employee_id, async function(req, res, next) {
  try {
    let user_id = req.params.id;
    let employee_info = await get_employee_info_by_id(user_id);
    let employee_infoData = employee_info[0];
    let path = `image/employee/${employee_infoData["user_id"]}_${employee_infoData["firstname"]}_${employee_infoData["lastname"]}.png`
    res.send(path);
  } catch (error) {
    console.error('get employee err:', error);
    res.status(error.status).send('Error fetching image');
  }
});

//request GET to access all customers info link to one coach
router.get('/:id/customer', check_token, check_employee_id, async function(req, res, next) {
  try {
    let coach_id = req.params.id;
    let customers_id = await get_customer_coach(coach_id);
    let coach_customers = [];
    for (let i = 0; i < customers_id.length; i++) {
      let customer_id = customers_id[i];
      // console.log(customer_id["customer_id"]);
      let customer_info_id = await get_customer_info_by_id(customer_id["customer_id"]);
      // console.log(customer_info_id);
      for (let j = 0; j < customer_info_id.length; j++) {
        coach_customers.push(customer_info_id[j]);
      }
    }
    // console.log(coach_customers);
    res.send(coach_customers);
  } catch (error) {
    console.error('get coach meetings err:', error);
    res.status(error.status).send(error);
  }
});

//request GET to access all meetings info of customers link to one coach
router.get('/:id/encounter', check_token, check_employee_id, async function(req, res, next) {
  try {
    let coach_id = req.params.id;
    let customers_id = await get_customer_coach(coach_id);
    let coach_meetings = [];
    for (let i = 0; i < customers_id.length; i++) {
      let customer_id = customers_id[i];
      // console.log(customer_id["customer_id"]);
      let customer_encounter_info_id = await get_customer_encounter_info_by_id(customer_id["customer_id"]);
      // console.log(customer_encounter_info_id);
      for (let j = 0; j < customer_encounter_info_id.length; j++) {
        coach_meetings.push(customer_encounter_info_id[j]);
      }
    }
    // console.log(coach_meetings);
    res.send(coach_meetings);
  } catch (error) {
    console.error('get coach meetings err:', error);
    res.status(error.status).send(error);
  }
});

//request POST to add one coach
router.post('/coach', check_token, async function(req, res, next) {
  try {
    let email =  req.body["email"];
    let firstname =  req.body["firstname"];
    let lastname =  req.body["lastname"];
    let gender =  req.body["gender"];
    let birth_date =  req.body["birth_date"];

    if (email === "" || firstname === "" || lastname === "" || gender === "" || birth_date === "") {
      res.status(500).send("Bad parameter");
      return;
    }
    let id = await get_max_id_employee();
    // console.log(`max id: ${id}`);
    id += 1;
    insert_employee_info(id, email, firstname, lastname, gender, birth_date, 'Coach');
    res.send('Done add coach');
  } catch (error) {
    console.error('get coach err:', error);
    res.status(error.status).send(error);
  }
});

//request GET to access all coachs info
router.get('/coach', check_token, async function(req, res, next) {
  try {
    let coachs_info = await get_coach_info();
    // console.log(coachs_info);
    res.send(coachs_info);
  } catch (error) {
    console.error('get coach err:', error);
    res.status(error.status).send(error);
  }
});

//request GET to access all meetings of all coachs info
router.get('/coach/statistic', check_token, async function(req, res, next) {
  try {
    let coachs_info = await get_coach_info();
    let all_coachs_meetings = [];
    for (let i = 0; i < coachs_info.length; i++) {
      let coach_id = coachs_info[i];
      // console.log(`coach_id = ${coach_id["user_id"]}`);
      let customers_id = await get_customer_coach(coach_id["user_id"]);
      let coach_meetings = [];
      for (let i = 0; i < customers_id.length; i++) {
        let customer_id = customers_id[i];
        // console.log(customer_id["customer_id"]);
        let customer_encounter_info_id = await get_customer_encounter_info_by_id(customer_id["customer_id"]);
        // console.log(customer_encounter_info_id);
        for (let j = 0; j < customer_encounter_info_id.length; j++) {
          coach_meetings.push(customer_encounter_info_id[j]);
        }
      }
      all_coachs_meetings.push({"coach_id": coach_id["user_id"],"tab": coach_meetings});
    }
    // console.log(coach_meetings);
    res.send(all_coachs_meetings);
  } catch (error) {
    console.error('get coach err:', error);
    res.status(error.status).send(error);
  }
});

//request GET to access all employees info
router.get('/', check_token, async function(req, res, next) {
  try {
    let employees_info = await get_employee_info();
    // console.log(employees_info);
    res.send(employees_info);
  } catch (error) {
    console.error('get employee err:', error);
    res.status(error.status).send(error);
  }
});

module.exports = {router, fill_employee_table};
