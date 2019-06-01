const url = require('url');
const constants = require('../common/constants');
const httpClient = require('../common/httpClient');
const qs = require('qs');

module.exports = async (email) => {

    email = "doron050@gmail.com"
    const res = await httpClient.post("now/registration", qs.stringify({
        email: email,
        tokenName: "Abc"
    }))

    let token = res.data.token;

    const res2 = await httpClient.get("now/registration/verify", qs.stringify({
        email: email,
        token: token
    }))

}