require('dotenv').config();
const {withUiHook, htm} = require('@zeit/integration-utils');
const mongo = require('../common/mongodb');
const integ = require('./projectIntegration');

async function getSubscriber(configurationId) {
    const subscriber = await mongo.getDoc(configurationId);
    return subscriber ? subscriber : {};
}

function getLogTokenForProject(subscriber, projectId) {
    if (subscriber && subscriber.projects && subscriber.projects[projectId])
        return subscriber.projects[project.id].logDnaToken;

    return null;
}

function createProjectUI(project, subscriber, currentAction) {
    return htm`
    <Container>
        <P>Connect Project ${project.name}</P>
        <Input label="LogDNA token" name="token" value="${getLogTokenForProject(subscriber, project.id) ? getLogTokenForProject(subscriber, project.id) : ''}" />
        <Button action="submit-${project.id}">Connect</Button>
        ${currentAction === 'submit-' + project.id ? '    Saved' : ''}
    </Container>
    `;
}

module.exports = withUiHook(async ({payload}) => {
    const projects = [{id: 'a', name: 'aaa'}, {id: 'b', name: 'bbb'}, {id: 'c', name: 'ccc'}];
    const {clientState, action, configurationId} = payload;

    const subscriber = await getSubscriber(configurationId);
    console.log({subscriber});

    if (action === 'submit') {
        subscriber.logDnaToken = clientState.token;
        subscriber.active = !!clientState.token;

        await mongo.upsertDoc(configurationId, subscriber);
    }

    const header = htm`<H1>LogDNA configuration page:</H1>`;
    let projectsUI=[];
    for (let i = 0; i < projects.length; i++) {
        projectsUI.push(createProjectUI(projects[i], subscriber, action));
    }

    return htm`
    <Page>
      ${header}
      ${projectsUI}
    </Page>
  `
});