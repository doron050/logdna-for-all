require('dotenv').config();
const {withUiHook, htm} = require('@zeit/integration-utils');
const mongo = require('../common/mongodb');


async function getSubscriber(configurationId) {
    const subscriber = await mongo.getDoc(configurationId);
    return subscriber ? subscriber : {};
}

module.exports = withUiHook(async ({payload, zeitClient}) => {
    const {clientState, action, configurationId} = payload;

    const subscriber = await getSubscriber(configurationId);

    if (action === 'submit') {
        subscriber.logDnaToken = clientState.token;
        subscriber.active = !!clientState.token;

        await mongo.upsertDoc(configurationId, subscriber);
    }

    return htm`
    <Page>
      <P>LogDNA configuration page:</P>
      <Container>
        <Input label="LogDNA token" name="token" value="${subscriber.logDnaToken ? subscriber.logDnaToken : ''}" />
      </Container>

      <Container>
          <Button action="submit">Submit</Button>
          ${action === 'submit' ? '    Saved' : ''}
      </Container>
    </Page>
  `
});