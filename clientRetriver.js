const mongo = require('./common/mongodb');
const _ = require("lodash");
var mySubCollection = mongo.getLogzCollection();

var subscriberPIDlist;

function syncCollection() {
    var currentActiveSubCollection = mongo.getLogzCollection();
    addNewSubs(mySubCollection, currentActiveSubCollection);

    mySubCollection.forEach(oldSubscriberData => {
        var latestSubscriberData = currentActiveSubCollection.find(current => current.integrationId === oldSubscriberData.integrationId);
        if (isSubscriberStatusUpdate(oldSubscriberData, latestSubscriberData)) {
            mySubCollection.splice(_.findIndex(mySubCollection, function (temp) {
                return isSameSubscriber(temp, oldSubscriberData);
            }), 1);

            // kill loop for this subscriber
            var subToKill = subscriberPIDlist.find(x => x.Subscriber.integrationId == latestSubscriberData.integrationId);
            clearTimeout(subToKill.Pid);
        }
    });
}

function handleClient(client) {
    console.log(`handling client, ID: ${client.integrationId}`);
}

function addNewSubs(mySubCollection, currentActiveSubCollection) {
    currentActiveSubCollection.forEach(newSub => {
        if (!mySubCollection.some(e => e.integrationId === newSub.integrationId)) {
            mySubCollection.push(newSub);
            
            const _pid = setInterval(() => handleClient(newSub), 1000);
            subscriberPIDlist.push({
                Pid:_pid,
                Subscriber: newSub
            });
        }
    });
}

// function subscriberComparator(sub1, sub2) {
//     return (isSameSubscriber(sub1, sub2) && isSubscriberStatusUpdate(sub1, sub2));
// }

function isSubscriberStatusUpdate(sub1, sub2) {
    return (sub1.active !== sub2.active)
}

function isSameSubscriber(sub1, sub2) {
    return (sub1.integrationId === sub2.integrationId);
}

module.exports = {
    syncCollection
}