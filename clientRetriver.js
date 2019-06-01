const mongo = require('./common/mongodb');
const _ = require("lodash");
const clientHandler = require('./clientHandler');
const consts = require('./common/constants');

const subscribedProjectsCollection = [];
const subscriberPIDlist = [];

const _clientRetriverPid = setInterval(() => syncCollection(), consts.TIME_OUTS.SYNC_CYCLE);

async function syncCollection() {
    const newProjectCollection = await mongo.getLogzCollection();
    const mappedProjectCollection = mapProjects(newProjectCollection);

    addNewProjectCollectionSubs(subscribedProjectsCollection, mappedProjectCollection);
    removeDisabledCollectionSubs(subscribedProjectsCollection, mappedProjectCollection);
    updateTokenChanged(subscribedProjectsCollection, mappedProjectCollection);
}

function updateTokenChanged(subscribedProjectsCollection, currentActiveSubCollection) {
    currentActiveSubCollection.forEach(project => {

        // Check possibility of token change for same projectID
        const projDataInMemory = subscribedProjectsCollection.find(x => (x.ID === project.ID) && (x.active === project.active));
        if (projDataInMemory) {
            if (isDNATokenChanged(projDataInMemory, project)) {

                console.log(consts.LOG_MESSAGES.UPDATE_DNA_TOKEN_UDPATE + project.ID + " <--> " + project.logDnaToken)
                unsubscribeProject(subscribedProjectsCollection, project);
                subscribeProject(subscribedProjectsCollection, project);
            }
        }
    });
}

function removeDisabledCollectionSubs(subscribedProjectsCollection, currentActiveSubCollection) {
    subscribedProjectsCollection.forEach(existingProject => {
        const newProjectData = currentActiveSubCollection.find(p => p.ID === existingProject.ID);
        if (newProjectData) {

            if (isSubscriberStatusUpdate(newProjectData, existingProject)) {
                console.log(consts.LOG_MESSAGES.STATUS_CHANGE + existingProject.ID);
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
    const processToKill = subscriberPIDlist.find(x => x.Project.ID == projectToRemove.ID);
    if (processToKill) {
        console.log(consts.LOG_MESSAGES.TERMINATION_NOTICE + processToKill.Project.ID);
        clearTimeout(processToKill.Pid); // TODO: interval ?


        subscriberPIDlist.splice(_.findIndex(subscriberPIDlist, function (temp) {
            return (temp.Project.ID === processToKill.Project.ID);
        }), 1);
    }
}

function startCycle(projectToRun) {
    const _pid = setInterval(() => clientHandler.handleProject(projectToRun), consts.TIME_OUTS.PROJECT_CYCLE); // TODO
    subscriberPIDlist.push({
        Pid: _pid,
        Project: projectToRun
    });
}

function addNewProjectCollectionSubs(subscribedProjectsCollection, currentActiveSubCollection) {
    currentActiveSubCollection.forEach(project => {
        if (!subscribedProjectsCollection.some(e => e.ID === project.ID)) {

            if (project.active) {
                console.log(consts.LOG_MESSAGES.NEW_CLIENT + project.ID);
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
    return (sub1.projectId === sub2.projectId);
}

module.exports = {
    syncCollection
}



function mapProjects(dbRawData) {

    const projectList = [];
    dbRawData.forEach(document => {

        if (!document.projects) {
            console.log(consts.LOG_MESSAGES.NO_PROJECTS_FOUND + document.configurationId);
        } else {
            document.projects.forEach(project => {
                projectList.push({
                    ID: project.projectId,
                    relatedConfID: document.configurationId,
                    zeitToken: document.zeitToken,
                    logDnaToken: project.logDnaToken,
                    active: project.active,
                    lastSentLogId: project.lastSentLogId,
                    teamID: document.teamId
                });
            });
        }
    });



    return projectList;


}