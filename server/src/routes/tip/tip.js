var axios = require('axios');
const {insert_tip_info, get_tip_info, need_update_tip, update_tip_info} = require('./tip.query');
var express = require('express');
const { check_token } = require('../../middleware/auth');
var router = express.Router();
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

//fill or update table tip
async function fill_tip_table(access_token, is_db_empty) {
  try {
    let tips = await axios.get('https://soul-connection.fr/api/tips', {
      headers: {
        'X-Group-Authorization': process.env.API_KEY_VALUE,
        'Authorization': `Bearer ${access_token}`
      }
    })
    let tipsData = tips.data;
    // for (let i = 0; i < 1; i++) {
    for (let i = 0; i < tipsData.length; i++) {
      let tipData = tipsData[i];
      if (is_db_empty) {
        insert_tip_info(tipData["id"], tipData["title"], tipData["tip"]);
      } else {
        let update = await need_update_tip(tipData["id"]);
        if (update) {
          update_tip_info(tipData["id"], tipData["title"], tipData["tip"]);
        } else {
          insert_tip_info(tipData["id"], tipData["title"], tipData["tip"]);
        }
      }
    }
    console.log("Fill tip table");
  } catch (error) {
    console.error('fill tip err:', error);
  }
}

//request GET to access all tips info
router.get('/', check_token, async function(req, res, next) {
  try {
    let tip_info = await get_tip_info();
    // console.log(tip_info);
    res.send(tip_info);
  } catch (error) {
    console.error('get tip err:', error);
    res.status(error.status).send(error);
  }
});

module.exports = {router, fill_tip_table};
