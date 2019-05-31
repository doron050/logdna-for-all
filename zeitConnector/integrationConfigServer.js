const constants = require('../common/constants');
const {withUiHook, htm} = require('@zeit/integration-utils');

const store = {token: ''};

module.exports = withUiHook(async ({payload, zeitClient}) => {

    const {clientState, action} = payload;

    if (action === 'submit') {
        store.token = clientState.token;
    }

    return htm`
    <Page>
      <P>LogDNA configuration page:</P>
      <Container>
        <Input label="LogDNA token" name="token" value="${store.token}" />
      </Container>
      
      <Container>
          <Button action="submit">Submit</Button>
          ${action === 'submit' ? '    Saved': ''}
      </Container>
    </Page>
  `
});