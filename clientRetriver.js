const mongo = require('./common/mongodb');
const _ = require("lodash");
const clientHandler = require('./clientHandler');
const consts = require('./common/constants');

// const mySubCollection = mongo.getLogzCollection();
const subscribedProjectsCollection = [];
const subscriberPIDlist = [];

// DELETE LATER
const debug = [{
        configurationId: "0",
        zeitToken: 'zeit-tocken-mock',
        projects: [{
                logDnaToken: "33bc25c119324ac7341346450188cbc4",
                active: true,
                projectId: 'project0',
                lastSentLogId: 'last-log-mock'
            },
            {
                logDnaToken: "33bc25c119324ac7341346450188cbc4",
                active: true,
                projectId: 'project0.1',
                lastSentLogId: 'last-log-mock'
            }
        ]
    },
    {
        configurationId: "2",
        zeitToken: 'zeit-tocken-mock',
        projects: [{
            logDnaToken: "33bc25c119324ac7341346450188cbc4",
            active: true,
            projectId: 'project2.0',
            lastSentLogId: 'last-log-mock'
        }, {
            logDnaToken: "33bc25c119324ac7341346450188cbc4",
            active: true,
            projectId: 'project2.1',
            lastSentLogId: 'last-log-mock'
        }, {
            logDnaToken: "33bc25c119324ac7341346450188cbc4",
            active: true,
            projectId: 'project2.2',
            lastSentLogId: 'last-log-mock'
        }]
    }, {
        configurationId: "1",
        zeitToken: 'zeit-tocken-mock',
        projects: [{
            logDnaToken: "33bc25c119324ac7341346450188cbc4",
            active: true,
            projectId: 'project1',
            lastSentLogId: 'last-log-mock'
        }]
    }
];
addNewProjectSubs(subscribedProjectsCollection, debug);

const _clientRetriverPid = setInterval(() => syncCollection(), 5000);

function syncCollection() {

    // DELETE LATER
    // const currentActiveSubCollection = mongo.getLogzCollection();
    const currentActiveSubCollection = [{
        configurationId: "27",
        zeitToken: 'zeit-tocken-mock',
        projects: [{
            logDnaToken: "33bc25c119324ac7341346450188cbc4",
            active: true,
            projectId: 'project27',
            lastSentLogId: 'last-log-mock'
        }]
    }, {
        configurationId: "2",
        zeitToken: 'zeit-tocken-mock',
        projects: [{
            logDnaToken: "33bc25c119324ac7341346450188cbc4",
            active: false,
            projectId: 'project3',
            lastSentLogId: 'last-log-mock'
        }, {
            logDnaToken: "33bc25c119324ac7341346450188cbc4",
            active: true,
            projectId: 'project27.27',
            lastSentLogId: 'last-log-mock'
        }]
    }];


    addNewProjectSubs(subscribedProjectsCollection, currentActiveSubCollection);


    subscribedProjectsCollection.forEach(existingProject => {
        const newProjectData = mapProjects(currentActiveSubCollection).find(p => p.ID === existingProject.ID);
        if (newProjectData) {

            if (isSubscriberStatusUpdate(newProjectData, existingProject)) {
                console.log(consts.LOG_MESSAGES.STATUS_CHANGE + existingProject.ID);

                subscribedProjectsCollection.splice(_.findIndex(subscribedProjectsCollection, function (temp) {
                    return isSameSubscriber(temp, subscribedProject);
                }), 1);

                // kill loop for this subscriber
                const processToKill = subscriberPIDlist.find(x => x.Project.ID == newProjectData.ID);
                if (processToKill) {
                    console.log(consts.LOG_MESSAGES.TERMINATION_NOTICE + processToKill.Project.ID);
                    clearTimeout(processToKill.Pid);
                }
            }
        }
    });
}

function addNewProjectSubs(subscribedProjectsCollection, currentActiveSubCollection) {

    // Convert raw DB data to list of projects
    const projectList = mapProjects(currentActiveSubCollection);

    projectList.forEach(project => {

        if (!subscribedProjectsCollection.some(e => e.ID === project.ID)) {

            console.log(consts.LOG_MESSAGES.NEW_CLIENT + project.ID); // TODO: chnage log desc.
            subscribedProjectsCollection.push(project);

            const _pid = setInterval(() => clientHandler.handleClient(project), 1000); // TODO
            subscriberPIDlist.push({
                Pid: _pid,
                Project: project
            });
        }
    });
}

function isSubscriberStatusUpdate(sub1, sub2) {
    return (sub1.active !== sub2.active)
}

function isSameSubscriber(sub1, sub2) {
    return (sub1.projectId === sub2.projectId);
}

module.exports = {
    syncCollection
}



function mapProjects(dbRawData) {

    const projectList = [];
    dbRawData.forEach(projects => {
        projects.projects.forEach(project => {
            projectList.push({
                ID: project.projectId,
                relatedConfID: dbRawData.configurationId,
                zeitToken: dbRawData.zeitToken,
                logDnaToken: project.logDnaToken,
                active: project.active,
                lastSentLogId: project.lastSentLogId
            });
        });

    });

    return projectList;


}