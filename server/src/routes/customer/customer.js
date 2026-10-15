var axios = require('axios');
const {insert_customer_info, insert_customer_payement_info,
  insert_customer_encounter_info, get_customer_payement_info, get_customer_name_info,
  get_customer_info_by_id, get_customer_payement_info_by_id, get_customer_encounter_info_by_id,
  get_customer_info, link_client_to_coach, unlink_client_to_coach, get_customer_astro_info,
  need_update_customer, update_customer_info, need_update_customer_payement, update_customer_payement_info,
  need_update_customer_encounter, update_customer_encounter_info, need_update_clothe, insert_customer_clothe_info,
  update_customer_clothe_info, get_customer_clothe_info, get_customer_clothe_info_by_type, get_customer_clothe_info_by_id,
  get_customer_clothe_info_by_id_type, get_customer_encounter_info, unlink_all_client_to_coach, get_list_source} = require('./customer.query');
var express = require('express');
var router = express.Router();
const fs = require('fs');
const axiosRetry = require('axios-retry').default;
const {check_customer_id} = require('../../middleware/notFound');
const { check_token } = require('../../middleware/auth');

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

//download customer clothe image
async function download_customer_clothe_image(customer_id, clothe_id, type, access_token) {
  try {
    let employee_image = await axios.get(`https://soul-connection.fr/api/clothes/${clothe_id}/image`, {
      headers: {
        'X-Group-Authorization': process.env.API_KEY_VALUE,
        'Authorization': `Bearer ${access_token}`,
        'accept': 'image/png'
      },
      responseType: 'arraybuffer'
    });
    if (type == 'hat/cap') {
      type = 'hat';
    }
    fs.appendFile(`../client/public/image/clothe/${customer_id}_${clothe_id}_${type}.png`, Buffer.from(employee_image.data),
      (err) => {
        if (err) {
          // console.error('download_customer_clothe_image here err:', err);;
        }
        // console.log(`clothe ${clothe_id} image done`);
    });
  } catch (error) {
    if (error.status) {
      console.error(`download_customer_clothe_image err: ${error.status} ${error.config["url"]}`);
    } else {
      console.error(`pb api download_customer_clothe_image err: ${error}`);
    }
  }
}

//add or update row in table clothe
async function migrate_customer_clothe_info(customer_id, access_token, is_db_empty) {
  try {
    let customer_clothes = await axios.get(`https://soul-connection.fr/api/customers/${customer_id}/clothes`, {
      headers: {
        'X-Group-Authorization': process.env.API_KEY_VALUE,
        'Authorization': `Bearer ${access_token}`
      }
    })
    let customer_clothesData = customer_clothes.data;
    for (let j = 0; j < customer_clothesData.length; j++) {
      let customer_clotheData = customer_clothesData[j];
      // console.log(customer_clotheData);
      if (is_db_empty) {
        insert_customer_clothe_info(customer_id, customer_clotheData["id"], customer_clotheData["type"]);
      } else {
        let update = await need_update_clothe(customer_clotheData["id"]);
        if (update) {
          update_customer_clothe_info(customer_id, customer_clotheData["id"], customer_clotheData["type"]);
        } else {
          insert_customer_clothe_info(customer_id, customer_clotheData["id"], customer_clotheData["type"]);
        }
      }
      download_customer_clothe_image(customer_id, customer_clotheData["id"], customer_clotheData["type"], access_token);
    }
  } catch (error) {
    if (error.status) {
      console.error(`migrate_customer_payement_info err: ${error.status} ${error.config["url"]}`);
    } else {
      console.error(`pb api migrate_customer_payement_info err: ${error}`);
    }
  }
}

//add or update row in table encounter
async function migrate_customer_encounter_info(customer_id, access_token, is_db_empty) {
  try {
    let customer_encounters = await axios.get(`https://soul-connection.fr/api/encounters/customer/${customer_id}`, {
      headers: {
        'X-Group-Authorization': process.env.API_KEY_VALUE,
        'Authorization': `Bearer ${access_token}`
      }
    })
    let customer_encountersData = customer_encounters.data;
    for (let k = 0; k < customer_encountersData.length; k++) {
      let customer_encounter = await axios.get(`https://soul-connection.fr/api/encounters/${customer_encountersData[k].id}`, {
        headers: {
          'X-Group-Authorization': process.env.API_KEY_VALUE,
          'Authorization': `Bearer ${access_token}`
        }
      })
      let customer_encountertData = customer_encounter.data;
      // console.log(customer_encountertData);
      if (is_db_empty) {
        insert_customer_encounter_info(customer_encountertData["customer_id"], customer_encountertData["id"],
        customer_encountertData["date"], customer_encountertData["rating"],
        customer_encountertData["comment"], customer_encountertData["source"]);
      } else {
        let update = await need_update_customer_encounter(customer_encountertData["id"]);
        if (update) {
          update_customer_encounter_info(customer_encountertData["customer_id"], customer_encountertData["id"],
          customer_encountertData["date"], customer_encountertData["rating"],
          customer_encountertData["comment"], customer_encountertData["source"]);
        } else {
          insert_customer_encounter_info(customer_encountertData["customer_id"], customer_encountertData["id"],
          customer_encountertData["date"], customer_encountertData["rating"],
          customer_encountertData["comment"], customer_encountertData["source"]);
        }
      }
    }
  } catch (error) {
    if (error.status) {
      console.error(`migrate_customer_encounter_info err: ${error.status} ${error.config["url"]}`);
    } else {
      console.error(`pb api migrate_customer_encounter_info err: ${error}`);
    }
  }
}

//add or update row in table payement
async function migrate_customer_payement_info(customer_id, access_token, is_db_empty) {
  try {
    let customer_payements = await axios.get(`https://soul-connection.fr/api/customers/${customer_id}/payments_history`, {
      headers: {
        'X-Group-Authorization': process.env.API_KEY_VALUE,
        'Authorization': `Bearer ${access_token}`
      }
    })
    let customer_payementsData = customer_payements.data;
    for (let j = 0; j < customer_payementsData.length; j++) {
      let customer_payementData = customer_payementsData[j];
      // console.log(customer_payementData);
      if (is_db_empty) {
        insert_customer_payement_info(customer_id, customer_payementData["id"], customer_payementData["date"],
        customer_payementData["payment_method"], customer_payementData["amount"], customer_payementData["comment"]);
      } else {
        let update = await need_update_customer_payement(customer_payementData["id"]);
        if (update) {
          update_customer_payement_info(customer_id, customer_payementData["id"], customer_payementData["date"],
          customer_payementData["payment_method"], customer_payementData["amount"], customer_payementData["comment"]);
        } else {
          insert_customer_payement_info(customer_id, customer_payementData["id"], customer_payementData["date"],
          customer_payementData["payment_method"], customer_payementData["amount"], customer_payementData["comment"]);
        }
      }
    }
  } catch (error) {
    if (error.status) {
      console.error(`migrate_customer_payement_info err: ${error.status} ${error.config["url"]}`);
    } else {
      console.error(`pb api migrate_customer_payement_info err: ${error}`);
    }
  }
}

//download customer image
async function download_customer_image(employee_id, name, surname, access_token) {
  try {
    let employee_image = await axios.get(`https://soul-connection.fr/api/customers/${employee_id}/image`, {
      headers: {
        'X-Group-Authorization': process.env.API_KEY_VALUE,
        'Authorization': `Bearer ${access_token}`,
        'accept': 'image/png'
      },
      responseType: 'arraybuffer'
    });
    fs.appendFile(`../client/public/image/customer/${employee_id}_${name}_${surname}.png`, Buffer.from(employee_image.data),
      (err) => {
        if (err) {
          // console.error('download_customer_image err:', err);;
        }
        // console.log(`customer ${employee_id} image done`);
    });
  } catch (error) {
    if (error.status) {
      console.error(`download_customer_image err: ${error.status} ${error.config["url"]}`);
    } else {
      console.error(`pb api download_customer_image err: ${error}`);
    }
  }
}

//add or update row in table customer
async function migrate_customer_info(customer_id, access_token, is_db_empty) {
  try {
    let customer = await axios.get(`https://soul-connection.fr/api/customers/${customer_id}`, {
      headers: {
        'X-Group-Authorization': process.env.API_KEY_VALUE,
        'Authorization': `Bearer ${access_token}`
      }
    })
    let customerData = customer.data;
    // console.log(customerData);
    if (is_db_empty) {
      await insert_customer_info(customerData["id"], customerData["email"], customerData["name"],
      customerData["surname"], customerData["gender"], customerData["birth_date"],
      customerData["description"], customerData["astrological_sign"], customerData["phone_number"],
      customerData["address"]);
    } else {
      let update = await need_update_customer(customerData["id"]);
      if (update) {
        update_customer_info(customerData["id"], customerData["email"], customerData["name"],
        customerData["surname"], customerData["gender"], customerData["birth_date"],
        customerData["description"], customerData["astrological_sign"], customerData["phone_number"],
        customerData["address"]);
      } else {
        await insert_customer_info(customerData["id"], customerData["email"], customerData["name"],
        customerData["surname"], customerData["gender"], customerData["birth_date"],
        customerData["description"], customerData["astrological_sign"], customerData["phone_number"],
        customerData["address"]);
      }
    }
    download_customer_image(customerData["id"], customerData["name"], customerData["surname"],
    access_token);
  } catch (error) {
    if (error.status) {
      console.error(`migrate_customer_info err: ${error.status} ${error.config["url"]}`);
    } else {
      console.error(`pb api migrate_customer_info err: ${error}`);
    }
  }
}

//fill or update table customer, payement, encounter, clothe
async function fill_customer_table(access_token, is_db_empty) {
  try {
    let customers = await axios.get('https://soul-connection.fr/api/customers', {
      headers: {
        'X-Group-Authorization': process.env.API_KEY_VALUE,
        'Authorization': `Bearer ${access_token}`
      }
    })
    let customersData = customers.data;
    // for (let i = 0; i < 1; i++) {
    for (let i = 0; i < customersData.length; i++) {
      await migrate_customer_info(customersData[i].id, access_token, is_db_empty);
    }
    for (let i = 0; i < customersData.length; i++) {
      migrate_customer_payement_info(customersData[i].id, access_token, is_db_empty);
      migrate_customer_encounter_info(customersData[i].id, access_token, is_db_empty);
      await migrate_customer_clothe_info(customersData[i].id, access_token, is_db_empty);
    }
    console.log("Fill all customer info table");
  } catch (error) {
    console.error('fill_customer_table err:', error);
  }
}

//request GET to access all meetings info of one customer
router.get('/list_source', check_token, async function(req, res, next) {
  try {
    let customer_encounter_info_id = await get_list_source();
    // console.log(customer_encounter_info_id);
    res.send(customer_encounter_info_id);
  } catch (error) {
    console.error('get customer encounter by id:', error);
    res.status(error.status).send(error);
  }
});

//request GET to access all clothes images
router.get('/clothe', check_token, async function(req, res, next) {
  try {
    let customers_name = await get_customer_clothe_info();
    let customer_clothes_path = [];
    // console.log(customers_name);
    for (let i = 0; i < customers_name.length; i++) {
      let clothe = customers_name[i];
      let type = clothe["_type"];
      if (type == 'hat/cap') {
        type = 'hat';
      }
      customer_clothes_path.push(`/image/clothe/${clothe["customer_id"]}_${clothe["clothe_id"]}_${type}.png`);
    }
    res.send(customer_clothes_path);
  } catch (error) {
    console.error('get customers name err:', error);
    res.status(error.status).send(error);
  }
});

//request GET to access all top clothes images
router.get('/clothe/top', check_token, async function(req, res, next) {
  try {
    let customers_name = await get_customer_clothe_info_by_type('top');
    let customer_clothes_path = [];
    // console.log(customers_name);
    for (let i = 0; i < customers_name.length; i++) {
      let clothe = customers_name[i];
      let type = clothe["_type"];
      if (type == 'hat/cap') {
        type = 'hat';
      }
      customer_clothes_path.push(`/image/clothe/${clothe["customer_id"]}_${clothe["clothe_id"]}_${type}.png`);
    }
    res.send(customer_clothes_path);
  } catch (error) {
    console.error('get customers name err:', error);
    res.status(error.status).send(error);
  }
});

//request GET to access all bottom clothes images
router.get('/clothe/bottom', check_token, async function(req, res, next) {
  try {
    let customers_name = await get_customer_clothe_info_by_type('bottom');
    let customer_clothes_path = [];
    // console.log(customers_name);
    for (let i = 0; i < customers_name.length; i++) {
      let clothe = customers_name[i];
      let type = clothe["_type"];
      if (type == 'hat/cap') {
        type = 'hat';
      }
      customer_clothes_path.push(`/image/clothe/${clothe["customer_id"]}_${clothe["clothe_id"]}_${type}.png`);
    }
    res.send(customer_clothes_path);
  } catch (error) {
    console.error('get customers name err:', error);
    res.status(error.status).send(error);
  }
});

//request GET to access all hats images
router.get('/clothe/hat', check_token, async function(req, res, next) {
  try {
    let customers_name = await get_customer_clothe_info_by_type('hat/cap');
    let customer_clothes_path = [];
    // console.log(customers_name);
    for (let i = 0; i < customers_name.length; i++) {
      let clothe = customers_name[i];
      let type = clothe["_type"];
      if (type == 'hat/cap') {
        type = 'hat';
      }
      customer_clothes_path.push(`/image/clothe/${clothe["customer_id"]}_${clothe["clothe_id"]}_${type}.png`);
    }
    res.send(customer_clothes_path);
  } catch (error) {
    console.error('get customers name err:', error);
    res.status(error.status).send(error);
  }
});

//request GET to access all shoes images
router.get('/clothe/shoe', check_token, async function(req, res, next) {
  try {
    let customers_name = await get_customer_clothe_info_by_type('shoes');
    let customer_clothes_path = [];
    // console.log(customers_name);
    for (let i = 0; i < customers_name.length; i++) {
      let clothe = customers_name[i];
      let type = clothe["_type"];
      if (type == 'hat/cap') {
        type = 'hat';
      }
      customer_clothes_path.push(`/image/clothe/${clothe["customer_id"]}_${clothe["clothe_id"]}_${type}.png`);
    }
    res.send(customer_clothes_path);
  } catch (error) {
    console.error('get customers name err:', error);
    res.status(error.status).send(error);
  }
});

//request GET to access all payements info of all customers
router.get('/payement', check_token, async function(req, res, next) {
  try {
    let customers_payement = await get_customer_payement_info();
    // console.log(customers_payement);
    res.send(customers_payement);
  } catch (error) {
    console.error('get customers payement err:', error);
    res.status(error.status).send(error);
  }
});

//request GET to access all encounters info of all customers
router.get('/encounter', check_token, async function(req, res, next) {
  try {
    let customers_payement = await get_customer_encounter_info();
    // console.log(customers_payement);
    res.send(customers_payement);
  } catch (error) {
    console.error('get customers payement err:', error);
    res.status(error.status).send(error);
  }
});

//request GET to access id, firstname, lastname of all customers
router.get('/name', check_token, async function(req, res, next) {
  try {
    let customers_name = await get_customer_name_info();
    // console.log(customers_name);
    res.send(customers_name);
  } catch (error) {
    console.error('get customers name err:', error);
    res.status(error.status).send(error);
  }
});

//request GET to access id, firstname, lastname, astrological sign of all customers
router.get('/astro', check_token, async function(req, res, next) {
  try {
    let customers_astro = await get_customer_astro_info();
    // console.log(customers_astro);
    res.send(customers_astro);
  } catch (error) {
    console.error('get customers astro err:', error);
    res.status(error.status).send(error);
  }
});

//request POST to link one customer to one coach
router.post('/link_coach', check_token, async function(req, res, next) {
  try {
    let coach_id = req.body["coach_id"];
    let customers_id = req.body["customers_id"];

    if (coach_id === "" || customers_id === "") {
      res.status(500).send("Bad parameter");
      return;
    }
    unlink_all_client_to_coach(coach_id);
    for (let i = 0; i < customers_id.length; i++) {
      let customer_id = customers_id[i];
      link_client_to_coach(customer_id, coach_id);
    }
    res.send('Done');
  } catch (error) {
    console.error('link coach err:', error);
    res.status(error.status).send(error);
  }
});

//request DELETE to unlink one customer to one coach
router.delete('/link_coach', check_token, async function(req, res, next) {
  try {
    let coach_id = req.body["coach_id"];
    let customers_id = req.body["customers_id"];

    if (coach_id === "" || customers_id === "") {
      res.status(500).send("Bad parameter");
      return;
    }
    unlink_client_to_coach(customers_id, coach_id);
    res.send('Done');
  } catch (error) {
    console.error('unlink coach err:', error);
    res.status(error.status).send(error);
  }
});

//request GET to access image of one customer
router.get('/:id/image', check_token, check_customer_id, async function(req, res, next) {
  try {
    let user_id = req.params.id;
    let employee_info = await get_customer_info_by_id(user_id);
    let employee_infoData = employee_info[0];
    let path = `image/customer/${employee_infoData["customer_id"]}_${employee_infoData["firstname"]}_${employee_infoData["lastname"]}.png`
    res.send(path);
  } catch (error) {
    console.error('get employee err:', error);
    res.status(error.status).send('Error fetching image');
  }
});

//request GET to access all clothes images of one customer
router.get('/clothe/:id', check_token, check_customer_id, async function(req, res, next) {
  try {
    let user_id = req.params.id;
    let customers_name = await get_customer_clothe_info_by_id(user_id);
    let customer_clothes_path = [];
    // console.log(customers_name);
    for (let i = 0; i < customers_name.length; i++) {
      let clothe = customers_name[i];
      let type = clothe["_type"];
      if (type == 'hat/cap') {
        type = 'hat';
      }
      customer_clothes_path.push(`/image/clothe/${clothe["customer_id"]}_${clothe["clothe_id"]}_${type}.png`);
    }
    res.send(customer_clothes_path);
  } catch (error) {
    console.error('get customers name err:', error);
    res.status(error.status).send(error);
  }
});

//request GET to access all clothes top images of one customer
router.get('/clothe/:id/top', check_token, check_customer_id, async function(req, res, next) {
  try {
    let user_id = req.params.id;
    let customers_name = await get_customer_clothe_info_by_id_type(user_id, 'top');
    let customer_clothes_path = [];
    // console.log(customers_name);
    for (let i = 0; i < customers_name.length; i++) {
      let clothe = customers_name[i];
      let type = clothe["_type"];
      if (type == 'hat/cap') {
        type = 'hat';
      }
      customer_clothes_path.push(`/image/clothe/${clothe["customer_id"]}_${clothe["clothe_id"]}_${type}.png`);
    }
    res.send(customer_clothes_path);
  } catch (error) {
    console.error('get customers name err:', error);
    res.status(error.status).send(error);
  }
});

//request GET to access all clothes bottom images of one customer
router.get('/clothe/:id/bottom', check_token, check_customer_id, async function(req, res, next) {
  try {
    let user_id = req.params.id;
    let customers_name = await get_customer_clothe_info_by_id_type(user_id, 'bottom');
    let customer_clothes_path = [];
    // console.log(customers_name);
    for (let i = 0; i < customers_name.length; i++) {
      let clothe = customers_name[i];
      let type = clothe["_type"];
      if (type == 'hat/cap') {
        type = 'hat';
      }
      customer_clothes_path.push(`/image/clothe/${clothe["customer_id"]}_${clothe["clothe_id"]}_${type}.png`);
    }
    res.send(customer_clothes_path);
  } catch (error) {
    console.error('get customers name err:', error);
    res.status(error.status).send(error);
  }
});

//request GET to access all clothes shoes images of one customer
router.get('/clothe/:id/shoe', check_token, check_customer_id, async function(req, res, next) {
  try {
    let user_id = req.params.id;
    let customers_name = await get_customer_clothe_info_by_id_type(user_id, 'shoes');
    let customer_clothes_path = [];
    // console.log(customers_name);
    for (let i = 0; i < customers_name.length; i++) {
      let clothe = customers_name[i];
      let type = clothe["_type"];
      if (type == 'hat/cap') {
        type = 'hat';
      }
      customer_clothes_path.push(`/image/clothe/${clothe["customer_id"]}_${clothe["clothe_id"]}_${type}.png`);
    }
    res.send(customer_clothes_path);
  } catch (error) {
    console.error('get customers name err:', error);
    res.status(error.status).send(error);
  }
});

//request GET to access all clothes hat images of one customer
router.get('/clothe/:id/hat', check_token, check_customer_id, async function(req, res, next) {
  try {
    let user_id = req.params.id;
    let customers_name = await get_customer_clothe_info_by_id_type(user_id, 'hat/cap');
    let customer_clothes_path = [];
    // console.log(customers_name);
    for (let i = 0; i < customers_name.length; i++) {
      let clothe = customers_name[i];
      let type = clothe["_type"];
      if (type == 'hat/cap') {
        type = 'hat';
      }
      customer_clothes_path.push(`/image/clothe/${clothe["customer_id"]}_${clothe["clothe_id"]}_${type}.png`);
    }
    res.send(customer_clothes_path);
  } catch (error) {
    console.error('get customers name err:', error);
    res.status(error.status).send(error);
  }
});

//request GET to access all payements info of one customer
router.get('/payement/:id', check_token, check_customer_id, async function(req, res, next) {
  try {
    let id = req.params.id;
    let customer_payement_info_id = await get_customer_payement_info_by_id(id);
    // console.log(customer_payement_info_id);
    res.send(customer_payement_info_id);
  } catch (error) {
    console.error('get customer payement by id err:', error);
    res.status(error.status).send(error);
  }
});

//request GET to access all meetings info of one customer
router.get('/encounter/:id', check_token, check_customer_id, async function(req, res, next) {
  try {
    let id = req.params.id;
    let customer_encounter_info_id = await get_customer_encounter_info_by_id(id);
    // console.log(customer_encounter_info_id);
    res.send(customer_encounter_info_id);
  } catch (error) {
    console.error('get customer encounter by id:', error);
    res.status(error.status).send(error);
  }
});

//request GET to access all info of one customer
router.get('/:id', check_token, check_customer_id, async function(req, res, next) {
  try {
    let id = req.params.id;
    let customer_info_id = await get_customer_info_by_id(id);
    // console.log(customer_info_id);
    res.send(customer_info_id);
  } catch (error) {
    console.error('get customer info by id err:', error);
    res.status(error.status).send(error);
  }
});

//request GET to access all customers info
router.get('/', check_token, async function(req, res, next) {
  try {
    let customers_info = await get_customer_info();
    // console.log(customers_info);
    res.send(customers_info);
  } catch (error) {
    console.error('get customer err:', error);
    res.status(error.status).send(error);
  }
});

module.exports = {router, fill_customer_table};
