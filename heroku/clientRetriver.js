const mongo = require('../common/mongodb');
const _ = require("lodash");
const clientHandler = require('./clientHandler');
const constants = require('../common/constants');
const logger = require('../common/logger');

const subscribedProjectsCollection = [];
const subscriberPIDlist = [];

setInterval(() => syncCollection(), constants.TIME_OUTS.SYNC_CYCLE);

async function syncCollection() {
    const newProjectCollection = await mongo.getLogzCollection();
    const mappedProjectCollection = mapProjects(newProjectCollection);

    removeMissingProjectCollectionSubs(subscribedProjectsCollection, mappedProjectCollection);
    addNewProjectCollectionSubs(subscribedProjectsCollection, mappedProjectCollection);
    removeDisabledCollectionSubs(subscribedProjectsCollection, mappedProjectCollection);
    updateTokenChanged(subscribedProjectsCollection, mappedProjectCollection);
}

function removeMissingProjectCollectionSubs(subscribedProjectsCollection, currentActiveSubCollection) {
    subscribedProjectsCollection.forEach(oldProject => {
        const projDataFound = currentActiveSubCollection.find(x => isSameSubscriber(x, oldProject));
        if (!projDataFound)
        {
            const existingProject = oldProject;
            logger.info(constants.LOG_MESSAGES.PROJECT_REMOVED + existingProject.projectName, existingProject.projectId, existingProject.configurationId, existingProject.active, existingProject.teamId, existingProject.teamName, existingProject.registrationDate, existingProject.userName, existingProject.userEmail, existingProject.projectName);
            unsubscribeProject(subscribedProjectsCollection, oldProject);
        }
    });

}

function updateTokenChanged(subscribedProjectsCollection, currentActiveSubCollection) {
    currentActiveSubCollection.forEach(project => {

        // Check possibility of token change for same projectID
        const projDataInMemory = subscribedProjectsCollection.find(x => isSameSubscriber(x, project) && (x.active === project.active));
        if (projDataInMemory) {
            if (isDNATokenChanged(projDataInMemory, project)) {

                logger.info(constants.LOG_MESSAGES.UPDATE_DNA_TOKEN_UDPATE + project.projectId + " <--> " + project.logDnaToken, project.projectId, project.configurationId, project.active, project.teamId, project.teamName, project.registrationDate, project.userName, project.userEmail, project.projectName);
                // console.log(constants.LOG_MESSAGES.UPDATE_DNA_TOKEN_UDPATE + project.projectId + " <--> " + project.logDnaToken)
                unsubscribeProject(subscribedProjectsCollection, project);
                subscribeProject(subscribedProjectsCollection, project);
            }
        }
    });
}

function removeDisabledCollectionSubs(subscribedProjectsCollection, currentActiveSubCollection) {
    subscribedProjectsCollection.forEach(existingProject => {
        const newProjectData = currentActiveSubCollection.find(p => isSameSubscriber(p, existingProject));
        if (newProjectData) {

            if (isSubscriberStatusUpdate(newProjectData, existingProject)) {
                logger.info(constants.LOG_MESSAGES.STATUS_CHANGE + existingProject.projectId, existingProject.projectId, existingProject.configurationId, existingProject.active, existingProject.teamId, existingProject.teamName, existingProject.registrationDate, existingProject.userName, existingProject.userEmail, existingProject.projectName);
                // console.log(constants.LOG_MESSAGES.STATUS_CHANGE + existingProject.projectId);
                unsubscribeProject(subscribedProjectsCollection, newProjectData);
            }
        }
    });
}

function unsubscribeProject(subscribedProjectsCollection, projectToRemove) {
    subscribedProjectsCollection.splice(_.findIndex(subscribedProjectsCollection, function (temp) {
        return isSameSubscriber(temp, projectToRemove);
    }), 1);
    killCycle(projectToRemove);
}

function subscribeProject(subscribedProjectsCollection, projectToAdd) {
    subscribedProjectsCollection.push(projectToAdd);
    startCycle(projectToAdd);
}

function killCycle(projectToRemove) {
    const processToKill = subscriberPIDlist.find(x => isSameSubscriber(x.Project, projectToRemove));
    if (processToKill) {
        const project = processToKill.Project;
        logger.info(constants.LOG_MESSAGES.TERMINATION_NOTICE + processToKill.Project.projectId, project.projectId, project.configurationId, project.active, project.teamId, project.teamName, project.registrationDate, project.userName, project.userEmail, project.projectName);
        // console.log(constants.LOG_MESSAGES.TERMINATION_NOTICE + processToKill.Project.projectId);
        clearInterval(processToKill.Pid);


        subscriberPIDlist.splice(_.findIndex(subscriberPIDlist, function (temp) {
            return (isSameSubscriber(temp.Project, processToKill.Project));
        }), 1);
    }
}

function startCycle(projectToRun) {
    const _pid = setInterval(() => clientHandler.handleProject(projectToRun), constants.TIME_OUTS.PROJECT_CYCLE); // TODO
    subscriberPIDlist.push({
        Pid: _pid,
        Project: projectToRun
    });
}

function addNewProjectCollectionSubs(subscribedProjectsCollection, currentActiveSubCollection) {
    currentActiveSubCollection.forEach(project => {
        if (!subscribedProjectsCollection.some(e => isSameSubscriber(e, project))) {

            if (project.active) {
                logger.info(constants.LOG_MESSAGES.NEW_CLIENT + project.projectId, project.projectId, project.configurationId, project.active, project.teamId, project.teamName, project.registrationDate, project.userName, project.userEmail, project.projectName);
                // console.log(constants.LOG_MESSAGES.NEW_CLIENT + project.projectId);
                subscribeProject(subscribedProjectsCollection, project);
            }
        }
    });
}

function isSubscriberStatusUpdate(sub1, sub2) {
    return (sub1.active !== sub2.active)
}

function isDNATokenChanged(sub1, sub2) {
    return (sub1.logDnaToken !== sub2.logDnaToken)
}

function isSameSubscriber(sub1, sub2) {
    return ((sub1.configurationId === sub2.configurationId) && (sub1.projectId === sub2.projectId));
}

function validateMongoRow(project, document) {
    let valid = true;
    let missingParams = [];

    if (!project.projectId) {
        valid = false;
        missingParams.push('Project ID');
    }
    if (!project.logDnaToken) {
        valid = false;
        missingParams.push('Log DNA token');
    }
    if (!document.configurationId) {
        valid = false;
        missingParams.push('Configuration ID');
    }
    if (!document.zeitToken) {
        valid = false;
        missingParams.push('ZEIT Token');
    }
    // if (!document.teamId) {
    //     valid = false;
    //     missingParams.push('Team ID');
    // }

    if (!valid) {
        logger.error(constants.LOG_MESSAGES.MISSING_PARAMETERS_FROM_DB(missingParams, document.configurationId), project.projectId, project.configurationId, project.active, project.teamId, project.teamName, project.registrationDate, project.userName, project.userEmail, project.projectName);
        // console.log(constants.LOG_MESSAGES.MISSING_PARAMETERS_FROM_DB(missingParams, document.configurationId));
    }

    return valid;
}

function mapProjects(dbRawData) {

    const projectList = [];
    dbRawData.forEach(document => {

        if (!document.projects) {
            logger.error(constants.LOG_MESSAGES.NO_PROJECTS_FOUND + document.configurationId, null, document.configurationId);
            // console.log(constants.LOG_MESSAGES.NO_PROJECTS_FOUND + document.configurationId);
        } else {
            document.projects.forEach(project => {
                if (validateMongoRow(project, document)) {
                    projectList.push({
                        projectId: project.projectId,
                        configurationId: document.configurationId,
                        zeitToken: document.zeitToken,
                        logDnaToken: project.logDnaToken,
                        active: project.active,
                        lastSentLogId: project.lastSentLogId,
                        teamId: document.teamId,
                        lastSentLogTimestamp: project.lastSentLogTimestamp,
                        registrationDate: project.registrationDate,
                        teamName: document.teamName,
                        userName: document.userName,
                        userEmail: document.userEmail,
                        projectName: project.projectName
                    });
                }
            });
        }
    });


    return projectList;
}

module.exports = {
    syncCollection
};