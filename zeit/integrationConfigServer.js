require('dotenv').config();
const {
    withUiHook,
    htm
} = require('@zeit/integration-utils');
const dateAndTime = require('date-and-time');
const mongoClient = require('../common/mongodb');
const constants = require('../common/constants');
const uiConstants = require('../common/uiConstants');
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

async function updatePojectState(project, clientState, subscriber, configurationId, user, team) {

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

    if (user) {
        subscriber.userEmail = user.email;
        subscriber.userName = user.name;
    }

    if (team) {
        subscriber.teamName = team.name;
    }

    await mongoClient.upsertDoc(configurationId, subscriber);
}

function createProjectUI(project, subscriber, currentAction) {
    const isSaveAction = currentAction === ('submit-' + project.id);

    let zeitProject = getProjectById(subscriber, project.id);

    if (!zeitProject) zeitProject = {};

    const isActive = zeitProject && zeitProject.active;

    let isConnectAction = false;
    let isDisconnectAction = false;

    if (isSaveAction && !zeitProject.active) isDisconnectAction = true
    else if (isSaveAction && zeitProject.active) isConnectAction = true;

    return {
        isActive: zeitProject.active,
        htm: htm `
    <Box border-style="solid" border-width="1px" border-color="rgb(234, 234, 234)" border-radius="5px" background-color="white">
        <Box margin="15px">
            ${zeitProject.active ? htm`<Img position="absolute" title="connected" float="right" width="40px" height="40px" src="${uiConstants.LOGO.ON}" />` :  htm`<Img position="absolute" title="not connected" float="right" width="40px" height="40px" src="${uiConstants.LOGO.OFF}" />`}
            <H2>Connect <B>${project.name}</B>:</H2>
            ${uiConstants.LOG_SERIVCE_NAME} Token:
            <Input width="250px" type="password" name="${'token-' + project.id}" value="${getLogTokenForProject(subscriber, project.id)}" />
            <Button background-color="#4CAF50" width="250px" action="${'submit-' + project.id}">${isActive ? 'Disconnect' : 'Connect'}</Button> 
        </Box>
        ${isActive ? htm`
        <Box border-top-style="solid" border-top-width="1px" border-top-color="rgb(234, 234, 234)" background-color="rgb(250, 250, 250)">
            <Box  background-color="rgb(250, 250, 250)" margin-left="15px" color="rgb(68, 68, 68)">
                <Link href="${uiConstants.URLS.VIEW_LOGS}" target="_blank">View the logs on ${uiConstants.LOG_SERIVCE_NAME}</Link> | <B>Connected since:</B> ${dateAndTime.format(new Date(zeitProject.registrationDate), 'DD/MM/YYYY HH:mm:ss')}
            </Box>
        </Box>`: ''}
        ${isConnectAction ? htm`
        <Box>
            <Notice type="success">
                <B>Successfully connected ${project.name}</B> to ${uiConstants.LOG_SERIVCE_NAME}!
            </Notice>
        </Box>` :  ''}
        ${isDisconnectAction ? htm`
        <Box>
            <Notice type="message">
                <B>Successfully disconnected ${project.name}</B> from ${uiConstants.LOG_SERIVCE_NAME}!
            </Notice>
        </Box>` :  ''}
    </Box>
    <BR />
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
        configurationId,
        user,
        team
    } = payload;

    const subscriber = await getSubscriber(configurationId);

    for (let i = 0; i < projects.length; i++) {
        if (action === ('submit-' + projects[i].id)) {
            await updatePojectState(projects[i], clientState, subscriber, configurationId, user, team);
        }
    }

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
        <Box border-style="solid" border-width="1px" border-color="rgb(234, 234, 234)" border-radius="5px" background-color="white">
            <Box margin="15px">
                <H2>${activeCounter} / ${projects.length} projects connected to ${uiConstants.LOG_SERIVCE_NAME}</H2>
                <B>How to connect a project</B><BR />
                1. Visit <Link href="${uiConstants.URLS.GET_TOKEN}" target="_blank">${uiConstants.LOG_SERIVCE_NAME}</Link> to create a project and <B>get a token</B><BR />
                2. <B>Set the ${uiConstants.LOG_SERIVCE_NAME} token</B> for each project you wish to connect<BR />
                3. <B>View the project logs</B> on ${uiConstants.LOG_SERIVCE_NAME} and start monitoring!
            </Box>
            <Box border-top-style="solid" border-top-width="1px" border-top-color="rgb(234, 234, 234)" background-color="rgb(250, 250, 250)">
                <Box background-color="rgb(250, 250, 250)" margin-left="15px" color="rgb(68, 68, 68)">
                    If you already have a ${uiConstants.LOG_SERIVCE_NAME} token, you can use it
                </Box>
            </Box>
        </Box>
        <BR />
        ${projectsUI}
        <Box border-style="solid" border-width="1px" border-color="rgb(234, 234, 234)" border-radius="5px" background-color="white">
            <Box margin="15px">
               If you have any question or need any help, please contact us:
            </Box>
            <Box border-top-style="solid" border-top-width="1px" border-top-color="rgb(234, 234, 234)" background-color="rgb(250, 250, 250)">
                <Box background-color="rgb(250, 250, 250)" margin-left="15px" color="rgb(68, 68, 68)">
                email: <Link href="" target="_blank">${uiConstants.SERIVCE_AND_SUPPORT.EMAIL}</Link> | <Link href="${uiConstants.SERIVCE_AND_SUPPORT.GIT}" target="_blank">github</Link>
                </Box>
            </Box>
        </Box>
        <BR />
      </Box>  
    </Page>
  `
});