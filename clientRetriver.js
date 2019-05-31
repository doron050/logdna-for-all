const mongo = require('./common/mongodb');
const _ = require("lodash");
const clientHandler = require('./clientHandler');

// const mySubCollection = mongo.getLogzCollection();
const mySubCollection = [];
const subscriberPIDlist = [];

// DELETE LATER
const debug = [{
        integrationId: "11111111111",
        logDnaToken: "33bc25c119324ac7341346450188cbc4",
        active: true,
        projectId: 'proj1ID',
        zeitToken: 'zeitToken1',
        lastSentLogId: '123'
    },
    {
        integrationId: "2222222222",
        logDnaToken: "33bc25c119324ac7341346450188cbc4",
        active: true,
        projectId: 'proj2ID',
        zeitToken: 'zeitToken2',
        lastSentLogId: '123'
    }, {
        integrationId: "33333333333",
        logDnaToken: "33bc25c119324ac7341346450188cbc4",
        active: true,
        projectId: 'proj3ID',
        zeitToken: 'zeitToken3',
        lastSentLogId: '123'
    }
];
addNewSubs(mySubCollection, debug);

const _clientRetriverPid = setInterval(() => syncCollection(), 5000);

function syncCollection() {

    // DELETE LATER
    // const currentActiveSubCollection = mongo.getLogzCollection();
    const currentActiveSubCollection = [{
        integrationId: "444444444444",
        logDnaToken: "33bc25c119324ac7341346450188cbc4",
        active: true,
        projectId: 'NEWproj3ID',
        zeitToken: 'NEWzeitToken3',
        lastSentLogId: '123'
    }, {
        integrationId: "11111111111",
        logDnaToken: "33bc25c119324ac7341346450188cbc4",
        active: false,
        projectId: 'proj1ID',
        zeitToken: 'zeitToken1',
        lastSentLogId: '123'
    }];


    addNewSubs(mySubCollection, currentActiveSubCollection);

    mySubCollection.forEach(oldSubscriberData => {
        const latestSubscriberData = currentActiveSubCollection.find(current => current.integrationId === oldSubscriberData.integrationId);
        if (latestSubscriberData) {
            if (isSubscriberStatusUpdate(oldSubscriberData, latestSubscriberData)) {

                console.log(`Found sub with status change, ID: ${oldSubscriberData.integrationId}`);

                mySubCollection.splice(_.findIndex(mySubCollection, function (temp) {
                    return isSameSubscriber(temp, oldSubscriberData);
                }), 1);

                // kill loop for this subscriber
                const processToKill = subscriberPIDlist.find(x => x.Subscriber.integrationId == latestSubscriberData.integrationId);
                if (processToKill) {
                    console.log(`killing client ID: ${processToKill.Subscriber.integrationId}`);
                    clearTimeout(processToKill.Pid);
                }
            }
        }
    });
}

function addNewSubs(mySubCollection, currentActiveSubCollection) {
    currentActiveSubCollection.forEach(newSub => {
        if (!mySubCollection.some(e => e.integrationId === newSub.integrationId)) {

            console.log(`found new client, ID: ${newSub.integrationId}`);
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
    return (sub1.integrationId === sub2.integrationId);
}

module.exports = {
    syncCollection
}