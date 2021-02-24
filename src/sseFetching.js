var EventSource = require('eventsource')
const baseUrl = "https://localhost:8443"

class SseClassGuest {

    static evtSourceGuest = null;

    static initiateSse(userIp, addTemporaryPoints) {
        this.evtSourceGuest = new EventSource(baseUrl + "/subscribe/tempPoints/" + userIp);
    
        this.evtSourceGuest.onmessage = function(event) {
            const date = new Date();
            const formatedDate = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ":" +  date.getMilliseconds();
            console.log(formatedDate + ": SSE has been triggered and " + event.data + " temporary points were sent")
            addTemporaryPoints(event.data);
        }
    }

    static closeSse() {
        if (this.evtSourceGuest) {
            this.evtSourceGuest.close();
        }
    }
}

class SseClassUser {
    
    static evtSourcePoints = null;
    static evtSourceItems = null;
    static evtSourceProfile = null;

    static initiateSse(userId, awardPoints, awardItem, updateProfileProgress) {

        this.evtSourcePoints = new EventSource(baseUrl + "/subscribe/points/" + userId);
        this.evtSourceItems = new EventSource(baseUrl + "/subscribe/items/" + userId);
        this.evtSourceProfile = new EventSource(baseUrl + "/subscribe/profile/" + userId);

        this.evtSourcePoints.onmessage = function(event) {
            const date = new Date();
            const formatedDate = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ":" +  date.getMilliseconds();
            console.log(formatedDate + ": SSE has been triggered and " + event.data + " points were sent")
            awardPoints(parseInt(event.data));
        }
        this.evtSourceItems.onmessage = function(event) {
            const date = new Date();
            const formatedDate = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ":" +  date.getMilliseconds();
            console.log(formatedDate + ": SSE has been triggered and the item " + event.data + " was sent")
            awardItem(event.data);
        }
        this.evtSourceProfile.onmessage = function(event) {
            const date = new Date();
            const formatedDate = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ":" +  date.getMilliseconds();
            console.log(formatedDate + ": SSE has been triggered and the profile progress is now: " + event.data)
            updateProfileProgress(parseInt(event.data));
        }
    }

    static closeSse() {
        if (this.evtSourcePoints !== null) {
            this.evtSourcePoints.close();
            this.evtSourceItems.close();
            this.evtSourceProfile.close();
        }
    }
}

export {SseClassGuest, SseClassUser};