require('dotenv').config();
const {
    withUiHook,
    htm
} = require('@zeit/integration-utils');
const dateAndTime = require('date-and-time');
const mongoClient = require('../common/mongodb');
const constants = require('../common/constants');
const _ = require('lodash');

async function getSubscriber(configurationId) {
    const subscriber = await mongoClient.getDoc(configurationId);
    return subscriber ? subscriber : {};
}

function getProjectById(subscriber, id) {
    return _.find(subscriber.projects, x => x.projectId === id);
}

function getLogTokenForProject(subscriber, projectId) {
    if (subscriber && subscriber.projects) {
        const selectedProject = getProjectById(subscriber, projectId);
        if (selectedProject)
            return selectedProject.logDnaToken || '';
    }

    return '';
}

async function updatePojectState(project, clientState, subscriber, configurationId) {

    if (!subscriber.projects)
        subscriber.projects = [];


    const selectedProject = getProjectById(subscriber, project.id);

    if (!selectedProject) {
        const newProject = {
            logDnaToken: clientState['token-' + project.id],
            active: true,
            projectId: project.id,
            projectName: project.name,
            registrationDate: Date.now()
        };
        subscriber.projects.push(newProject);
    } else {
        selectedProject.logDnaToken = clientState['token-' + project.id];
        selectedProject.active = !selectedProject.active
    }
    await mongoClient.upsertDoc(configurationId, subscriber);
}

function createProjectUI(project, subscriber, currentAction) {
    const isSaveAction = currentAction === ('submit-' + project.id);

    let mongoProject = getProjectById(subscriber, project.id);

    if (!mongoProject) mongoProject = {};

    const isActive = mongoProject && mongoProject.active;

    let isConnectAction = false;
    let isDisconnectAction = false;

    if (isSaveAction && !mongoProject.active) isDisconnectAction = true
    else if (isSaveAction && mongoProject.active) isConnectAction = true;

    return {
        isActive: mongoProject.active,
        htm: htm `
    <Box border-style="groove" border-radius="5px" background-color="white">
        <Box margin="15px">
            ${mongoProject.active ? htm`<Img position="absolute" title="connected" float="right" width="40px" height="40px" src="https://github.com/doron050/logz-for-all/blob/master/resources/images/logDNA-Icon.png?raw=true" />` :  htm`<Img position="absolute" title="not connected" float="right" width="40px" height="40px" src="https://github.com/doron050/logdna-for-all/blob/master/resources/images/%E2%80%8F%E2%80%8FlogDNA-Icon-no.png?raw=true" />`}
            <H2>Connect <B>${project.name}</B>:</H2>
            LogDNA Token:
            <Input width="250px" type="password" name="${'token-' + project.id}" value="${getLogTokenForProject(subscriber, project.id)}" />
            <Button background-color="#4CAF50" width="250px" action="${'submit-' + project.id}">${isActive ? 'Disconnect' : 'Connect'}</Button> 
        </Box>
        ${isActive ? htm`<Box background-color="rgb(250, 250, 250)"><Box  background-color="rgb(250, 250, 250)" margin-left="15px" color="rgb(68, 68, 68)"><B>Connected since:</B> ${dateAndTime.format(new Date(mongoProject.registrationDate), 'DD/MM/YYYY HH:mm:ss')}</Box></Box>`: ''}
        ${isConnectAction ? htm`<Box><Notice type="success"><B>Successfuly connected ${project.name}</B> to LogDNA!</Notice></Box>` :  ''}
        ${isDisconnectAction ? htm`<Box><Notice type="message"><B>Successfuly disconnect ${project.name}</B> from LogDNA!</Notice></Box>` :  ''}
    </Box><BR />
    `};
}

module.exports = withUiHook(async ({
    payload,
    zeitClient
}) => {
    const projects = await zeitClient.fetchAndThrow("/" + constants.ZEIT_API_ROUTES.PROJECTS, {});
    const {
        clientState,
        action,
        configurationId
    } = payload;

    const subscriber = await getSubscriber(configurationId);

    for (let i = 0; i < projects.length; i++) {
        if (action === ('submit-' + projects[i].id)) {
            await updatePojectState(projects[i], clientState, subscriber, configurationId);
        }
    }

    const header = htm `<H1>Your Projects Integrations with LogDNA:</H1>`;
    let projectsUI = [];
    let activeCounter = 0;
    let currentUI;
    for (let i = 0; i < projects.length; i++) {
        
        currentUI = createProjectUI(projects[i], subscriber, action);

        if (currentUI.isActive) activeCounter++;
        projectsUI.push(currentUI.htm);
    }

    return htm `
    <Page>
      <Box>
      <BR />
      ${header}
      Let us connect your world. Say goodbay to loggers!
      <BR /><BR />
      <Box border-style="groove" border-radius="5px" background-color="white">
        <Box margin="15px">
            <H2>${activeCounter} / ${projects.length} projects connected</H2>
            Visit <Link href="https://logdna.com" target="_blank">LogDNA</Link> to create a project and get a token.
        </Box>
        <Box background-color="rgb(250, 250, 250)">
            <Box background-color="rgb(250, 250, 250)" margin-left="15px" color="rgb(68, 68, 68)">
            If you already have a project, you can use that instead
            </Box>
        </Box>
      </Box>
      <BR />
      ${projectsUI}
      <BR />

      </Box>  
    </Page>
  `
});