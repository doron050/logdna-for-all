require('dotenv').config();
const {withUiHook, htm} = require('@zeit/integration-utils');
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
            active: !!clientState['token-' + project.id],
            projectId: project.id,
        };
        subscriber.projects.push(newProject);
    } else {
        selectedProject.logDnaToken = clientState['token-' + project.id];
        selectedProject.active = !!clientState['token-' + project.id];
    }

    await mongoClient.upsertDoc(configurationId, subscriber);
}

function createProjectUI(project, subscriber, currentAction) {
    const isSaveAction = currentAction === ('submit-' + project.id);

    const mongoProject = getProjectById(subscriber, project.id);
    const isActive = mongoProject && mongoProject.active;

    return htm`
    <Container>
        <P>Connect <B>${project.name}</B> to LogDNA:</P><BR />
        <Input width="250px" label="LogDNA Token:" type="password" name="${'token-' + project.id}" value="${getLogTokenForProject(subscriber, project.id)}" />
        <Button width="250px" action="${'submit-' + project.id}">${isActive ? 'Disconnect' : 'Connect'}</Button>
        ${isSaveAction ? htm`<Notice type="success">Successfuly connected to LogDNA!</Notice>` : ''}
    </Container>
    `;
}

module.exports = withUiHook(async ({payload, zeitClient}) => {
    const projects = await zeitClient.fetchAndThrow("/" + constants.ZEIT_API_ROUTES.PROJECTS, {});
    const {clientState, action, configurationId} = payload;

    const subscriber = await getSubscriber(configurationId);
    console.log({subscriber});
    console.log({payload});

    for (let i = 0; i < projects.length; i++) {
        if (action === ('submit-' + projects[i].id)) {
            await updatePojectState(projects[i], clientState, subscriber, configurationId);
        }
    }

    const header = htm`<H1>Connect your projects to LogDNA:</H1>`;
    let projectsUI = [];
    for (let i = 0; i < projects.length; i++) {
        projectsUI.push(createProjectUI(projects[i], subscriber, action));
    }

    return htm`
    <Page>
      <Box height="800px" background-repeat="round" border-radius="8px" background-image="url('https://github.com/doron050/logz-for-all/blob/master/resources/images/fuse-brussels-273772-unsplash.jpg?raw=true')">
      <BR />
      ${header}
      <H2>Let us connect your world -> Go and build your dashboard!</H2><BR />
      ${projectsUI}
      <BR />

      </Box>
      <Notice type="error">This is an error messgae.</Notice>
      <Notice type="warn">This is an error messgae.</Notice>
      
      <Notice type="message">This is an error messgae.</Notice>
      
      <Notice type="success">This is an error messgae.</Notice>
      
    </Page>
  `
});