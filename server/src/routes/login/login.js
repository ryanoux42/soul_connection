var axios = require('axios');
var express = require('express');
const {is_coach, insert_token} = require('./login.query');
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

//request POST to login
router.post('/', async function(req, res, next) {
  try {
    let mail = req.body["email"];
    let pwd = req.body["password"];

    // console.log(`test login: ${mail} ${pwd}`);
    // console.log(`api key: ${process.env.API_KEY_VALUE}`);
    if (mail === "" || pwd === "") {
      res.status(500).send("Bad parameter");
      return;
    }
    let response = await axios.post('https://soul-connection.fr/api/employees/login', {
      "email": mail,
      "password": pwd
    }, {headers: {
        'X-Group-Authorization': process.env.API_KEY_VALUE
      }
    })
    let responseData = response.data;
    let access_token = responseData["access_token"];
    // console.log(`here access token value: ${access_token}`);
    let responseId = await axios.get('https://soul-connection.fr/api/employees/me', {
      headers: {
        'X-Group-Authorization': process.env.API_KEY_VALUE,
        'Authorization': `Bearer ${access_token}`
      }
    })
    let responseIdData = responseId.data;
    // console.log(responseIdData);
    let user_id = responseIdData["id"];
    // console.log(`here user_id: ${user_id}`);
    insert_token(access_token);
    let right = await is_coach(user_id);
    res.json({"user_id": user_id, "is_coach": right, "token": access_token});
  } catch (error) {
    console.error(`login err: ${error}`);
    res.status(error.status).send(error);
  }
});

module.exports = router;