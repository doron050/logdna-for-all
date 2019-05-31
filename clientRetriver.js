const mongo = require('./common/mongodb');
const _ = require("lodash");
const clientHandler = require('./clientHandler');
const consts = require('./common/constants');

// const mySubCollection = mongo.getLogzCollection();
const mySubCollection = [];
const subscriberPIDlist = [];

// DELETE LATER
const debug = [{
        configurationId: "0",
        zeitToken: 'zeit-tocken-mock',
        projects: [{
            logDnaToken: "33bc25c119324ac7341346450188cbc4",
            active: true,
            projectId: 'project1',
            lastSentLogId: 'last-log-mock'
        }]
    },
    {
        configurationId: "1",
        zeitToken: 'zeit-tocken-mock',
        projects: [{
            logDnaToken: "33bc25c119324ac7341346450188cbc4",
            active: true,
            projectId: 'project2',
            lastSentLogId: 'last-log-mock'
        }]
    }, {
        configurationId: "2",
        zeitToken: 'zeit-tocken-mock',
        projects: [{
            logDnaToken: "33bc25c119324ac7341346450188cbc4",
            active: true,
            projectId: 'project3',
            lastSentLogId: 'last-log-mock'
        }]
    }
];
addNewSubs(mySubCollection, debug);

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
        }]
    }];


    addNewSubs(mySubCollection, currentActiveSubCollection);

    mySubCollection.forEach(oldSubscriberData => {
        const latestSubscriberData = currentActiveSubCollection.find(current => current.projects.projectId === oldSubscriberData.projects.projectId);
        if (latestSubscriberData) {
            if (isSubscriberStatusUpdate(oldSubscriberData, latestSubscriberData)) {

                console.log(consts.LOG_MESSAGES.STATUS_CHANGE + oldSubscriberData.projects.projectId);

                mySubCollection.splice(_.findIndex(mySubCollection, function (temp) {
                    return isSameSubscriber(temp, oldSubscriberData);
                }), 1);

                // kill loop for this subscriber
                const processToKill = subscriberPIDlist.find(x => x.Subscriber.projects.projectId == latestSubscriberData.projects.projectId);
                if (processToKill) {
                    console.log(consts.LOG_MESSAGES.TERMINATION_NOTICE + processToKill.Subscriber.projects.projectId);
                    clearTimeout(processToKill.Pid);
                }
            }
        }
    });
}

function addNewSubs(mySubCollection, currentActiveSubCollection) {
    currentActiveSubCollection.forEach(newSub => {
        if (!mySubCollection.some(e =>  e.projects.projectId === newSub.projects.projectId)) {

            console.log(consts.LOG_MESSAGES.NEW_CLIENT + newSub.projects.projectId);
            mySubCollection.push(newSub);

            const _pid = setInterval(() => clientHandler.handleClient(newSub), 1000);
            subscriberPIDlist.push({
                Pid: _pid,
                Subscriber: newSub
            });
        }
    });
}

function isSubscriberStatusUpdate(sub1, sub2) {
    return (sub1.active !== sub2.active)
}

function isSameSubscriber(sub1, sub2) {
    return (sub1.projects.projectId === sub2.projects.projectId);
}

module.exports = {
    syncCollection
}