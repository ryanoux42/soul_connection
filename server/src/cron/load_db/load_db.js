var axios = require('axios');
const {is_db_empty} = require('./load_db.query');
const {fill_employee_table} = require('../../routes/employee/employee');
const {fill_customer_table} = require('../../routes/customer/customer');
const { fill_tip_table } = require('../../routes/tip/tip');
const { fill_event_table } = require('../../routes/event/event');
const axiosRetry = require('axios-retry').default;

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

//fill or update all the db
async function load_update_db() {
  try {
    console.log(`start cron at ${new Date().toLocaleString()}`);
    let response = await axios.post('https://soul-connection.fr/api/employees/login', {
      "email": process.env.MAIL_TOKEN,
      "password": process.env.PWD_TOKEN
    }, {headers: {
        'X-Group-Authorization': process.env.API_KEY_VALUE
      }
    })
    let responseData = response.data;
    let access_token = responseData["access_token"];
    // console.log(`here access token value: ${access_token}`);
    let db_empty = await is_db_empty();
    fill_tip_table(access_token, db_empty);
    await fill_employee_table(access_token, db_empty);
    await fill_customer_table(access_token, db_empty);
    fill_event_table(access_token, db_empty);
    console.log(`db loading finish at ${new Date().toLocaleString()}`);
  } catch (error) {
    console.error(`db loading err: ${error}`);
  }
}

module.exports = {load_update_db};