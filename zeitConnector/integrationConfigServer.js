const constants = require('../common/constants');
const {withUiHook,htm} = require('@zeit/integration-utils');

let count = 0;

module.exports = withUiHook(async ({payload, zeitClient}) => {


    // console.log(constants.LOG_MESSAGES.NEW_INTEGRATION);
    //
    // const integrationDetails = {};
    // console.log(payload);
    // const u = payload.user;
    // console.log(u);
    // const p = payload.project;
    // console.log(p);
    // const t = payload.team;
    // console.log(t);
    // const {projectId} = payload;
    // let apiUrl = `/v4/now/deployments?limit=10`;
    // if (projectId) {
    //     apiUrl += `&projectId=${projectId}`
    // }
    //
    // const {deployments} = await zeitClient.fetchAndThrow(apiUrl, {method: 'GET'});
    //
    // console.log(deployments);
    //
    // const logs = await zeitClient.fetchAndThrow("/v2/now/deployments/" + "dpl_8qZ3rjJtDAK7E5DUoJN9ybz5rEem" + "/events", {method: 'GET'});
    //
    // console.log(logs.length);
    count += 1;
    return htm`
    <Page>
      <P>Counter: ${count}</P>
      <Button>Count Me</Button>
    </Page>
  `
});