var axios = require('axios');
const {insert_event_info, get_event_info, need_update_event, update_event_info, get_event_info_by_id} = require('./event.query');
var express = require('express');
var router = express.Router();
const axiosRetry = require('axios-retry').default;
const {check_token} = require('../../middleware/auth');
const {check_employee_id} = require('../../middleware/notFound');

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

//add or update row in table event
async function migrate_event_info(event_id, access_token, is_db_empty) {
  try {
    let event = await axios.get(`https://soul-connection.fr/api/events/${event_id}`, {
      headers: {
        'X-Group-Authorization': process.env.API_KEY_VALUE,
        'Authorization': `Bearer ${access_token}`
      }
    })
    let eventData = event.data;
    // console.log(eventData);
    if (is_db_empty) {
      insert_event_info(eventData["id"], eventData["name"], eventData["date"],
      eventData["duration"], eventData["max_participants"], eventData["location_x"],
      eventData["location_y"], eventData["type"], eventData["employee_id"],eventData["location_name"]);
    } else {
      let update = await need_update_event(eventData["id"]);
      if (update) {
        update_event_info(eventData["id"], eventData["name"], eventData["date"],
        eventData["duration"], eventData["max_participants"], eventData["location_x"],
        eventData["location_y"], eventData["type"], eventData["employee_id"],eventData["location_name"]);
      } else {
        insert_event_info(eventData["id"], eventData["name"], eventData["date"],
        eventData["duration"], eventData["max_participants"], eventData["location_x"],
        eventData["location_y"], eventData["type"], eventData["employee_id"],eventData["location_name"]);
      }
    }
  } catch (error) {
    if (error.status) {
      console.error(`migrate_event_info err: ${error.status} ${error.config["url"]}`);
    } else {
      console.error(`pb api migrate_event_info err: ${error}`);
    }
  }
}

//fill or update table event
async function fill_event_table(access_token, is_db_empty) {
  try {
    let events = await axios.get('https://soul-connection.fr/api/events', {
      headers: {
        'X-Group-Authorization': process.env.API_KEY_VALUE,
        'Authorization': `Bearer ${access_token}`
      }
    })
    let eventsData = events.data;
    // for (let i = 0; i < 1; i++) {
    for (let i = 0; i < eventsData.length; i++) {
      migrate_event_info(eventsData[i].id, access_token, is_db_empty);
    }
    console.log("Fill event table");
  } catch (error) {
    console.error('fill events err:', error);
  }
}

//request GET to access all events info of one employee
router.get('/:id', check_token, check_employee_id, async function(req, res, next) {
  try {
    let user_id = req.params.id;
    let event_info = await get_event_info_by_id(user_id);
    // console.log(event_info);
    res.send(event_info);
  } catch (error) {
    console.error('get event err:', error);
    res.status(error.status).send(error);
  }
});

//request GET to access all events info
router.get('/', check_token, async function(req, res, next) {
  try {
    let event_info = await get_event_info();
    // console.log(event_info);
    res.send(event_info);
  } catch (error) {
    console.error('get event err:', error);
    res.status(error.status).send(error);
  }
});

module.exports = {router, fill_event_table};
