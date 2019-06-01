require('dotenv').config();
const {withUiHook, htm} = require('@zeit/integration-utils');
const mongo = require('../common/mongodb');
const _ = require('lodash');

//const integ = require('./projectIntegration');

async function getSubscriber(configurationId) {
    const subscriber = await mongo.getDoc(configurationId);
    return subscriber ? subscriber : {};
}

function getProjectById(subscriber, id) {
    return _.find(subscriber.projects, x => x.projectId === id);
}

function getLogTokenForProject(subscriber, projectId) {
    if (subscriber && subscriber.projects) {
        const selectedProject = getProjectById(subscriber,projectId);
        if (selectedProject)
            return selectedProject.logDnaToken || '';
    }

    return '';
}

async function updatePojectState(project, clientState, subscriber, configurationId) {
    console.log('work on project save');
    if (!subscriber.projects)
        subscriber.projects = [];

    const selectedProject = getProjectById(subscriber,project.id);
    if (!selectedProject) {
        const newProject = {
            logDnaToken: clientState['token-' + project.id],
            active: !!clientState['token-' + project.id],
            projectId: project.id,
        };
        subscriber.projects.push(newProject);
    } else {
        selectedProject.logDnaToken = clientState['token-' + project.id];
        selectedProject.active = !!clientState['token-' + project.id];
    }

    await mongo.upsertDoc(configurationId, subscriber);
}

function createProjectUI(project, subscriber, currentAction) {
    const isSaveAction = currentAction === ('submit-' + project.id);

    const mongoProject = getProjectById(subscriber, project.id);
    const isActive = mongoProject && mongoProject.active;

    return htm`
    <Container>
        <P>Connect Project ${project.name}</P>
        <Input label="LogDNA token" name="${'token-' + project.id}" value="${getLogTokenForProject(subscriber, project.id)}" />
        <Button action="${'submit-' + project.id}">${isActive ? 'Disconnect' : 'Connect'}</Button>
        ${ isSaveAction ? 'Saved' : ''}
    </Container>
    `;
}

module.exports = withUiHook(async ({payload}) => {
    const projects = [{id: 'a', name: 'aaa'}, {id: 'b', name: 'bbb'}, {id: 'c', name: 'ccc'}];
    const {clientState, action, configurationId} = payload;

    const subscriber = await getSubscriber(configurationId);
    console.log({subscriber});
    console.log(action);
    //const blaa = await integ.getTeamProjects('NueSG6t5Y8EoTcnOfaMOroa1');
    //console.log({blaa});

    for (let i = 0; i < projects.length; i++) {
        if (action === ('submit-' + projects[i].id)) {
            await updatePojectState(projects[i], clientState, subscriber, configurationId);
        }
    }

    const header = htm`<H1>LogDNA configuration page:</H1>`;
    let projectsUI = [];
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