require('dotenv').config();
const constants = require('../common/constants');
const {withUiHook, htm} = require('@zeit/integration-utils');
const mongo = require('../common/mongodb');


async function getSubscriber(integrationId) {
    const subscriber = await mongo.getDoc(integrationId);
    return subscriber ? subscriber : {};
}

module.exports = withUiHook(async ({payload, zeitClient}) => {
    const {clientState, action, integrationId} = payload;
    console.log(integrationId);

    const subscriber = await getSubscriber(integrationId);

    if (action === 'submit') {
        subscriber.logDnaToken = clientState.token;
        await mongo.updateDoc(integrationId,subscriber);
    }

    return htm`
    <Page>
      <P>LogDNA configuration page:</P>
      <Container>
        <Input label="LogDNA token" name="token" value="${subscriber.logDnaToken}" />
      </Container>

      <Container>
          <Button action="submit">Submit</Button>
          ${action === 'submit' ? '    Saved' : ''}
      </Container>
    </Page>
  `
});