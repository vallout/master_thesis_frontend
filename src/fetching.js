const publicIp = require('public-ip');
const fetch = require('node-fetch');

const baseUrl = "https://localhost:8443";

const log_with_time = (input) => {
  const date = new Date();
  const formatedDate = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ":" +  date.getMilliseconds();
  console.log(formatedDate + ": " + input)
}

class FetchClass {

    static async getIpAddress() {
        return await publicIp.v4()
    }
    
    static async triggerTmpPointsEvent(keyWord, ipAddress){
      var requestOptions = {
          method: 'POST',
          headers: {"Content-Type": "application/json", "credentials": 'same-origin'},
          redirect: 'follow'
        };
        
        fetch(baseUrl + "/temporarypoints/add/" + keyWord + "/to/" + ipAddress, requestOptions)
        .then(
          response => {
            if (!response.ok) {
              throw new Error(response.status);
            }
            else return response;
          }
        )
    }    
    
    static async getTemporaryPoints(ipAddress) {
    
      var requestOptions = {
        method: 'GET',
        headers: {"Content-Type": "application/json", "credentials": 'same-origin'},
        redirect: 'follow'
      };
      
      return fetch(baseUrl + "/temporarypoints/get/" + ipAddress, requestOptions)
        .then(
          response => {
            if (!response.ok) {
              throw new Error(response.status);
            }
            else return response.json();
          }
        )
    }
    
    
    static async createUserChallenge(eventName, queryKeyword, begin, end, condition, rewardPoints, rewardItem){
      var raw = JSON.stringify({
        event: eventName,
        queryKeyword: queryKeyword,
        beginning: begin,
        end: end,
        occurencesAsCondition: condition,
        rewardPoints: rewardPoints,
        rewardItem: rewardItem
      });
    
      var requestOptions = {
        method: 'PUT',
        headers: {"Content-Type": "application/json", "credentials": 'same-origin'},
        body: raw,
        redirect: 'follow'
      };
      
      return fetch(baseUrl + "/userChallenge/set", requestOptions)
        .then(
          response => {
            if (!response.ok) {
              throw new Error(response.status);
            }
          }
        )
      }

    static async getQueryKeywords(eventName) {
    
      var requestOptions = {
        method: 'GET',
        headers: {"Content-Type": "application/json", "credentials": 'same-origin'},
        redirect: 'follow'
      };
      
      return fetch(baseUrl + "/userChallenge/get/QueryKeywords/" + eventName, requestOptions)
        .then(
          response => {
            if (!response.ok) {
              throw new Error(response.status);
            }
            else return response.json();
          }
        )
    }
    
    static async registerUser(ipAddress, info) {
        
        var raw = JSON.stringify({"title": info.title,"firstname": info.firstname,"lastname": info.lastname,"primaryMail": info.primaryMail});
        
        var requestOptions = {
          method: 'PUT',
          headers: {"Content-Type": "application/json", "credentials": 'same-origin'},
          body: raw,
          redirect: 'follow'
        };
        
        return fetch(baseUrl + "/user/register/" + ipAddress, requestOptions)
          .then(
            response => {
              if (!response.ok) {
                throw new Error(response.status);
              }
              else return response.json();
            }
          )
    }

    static async getUser(userId) {
      var requestOptions = {
        method: 'GET',
        headers: {"Content-Type": "application/json", "credentials": 'same-origin'},
        redirect: 'follow'
      };
      
      return fetch(baseUrl + "/user/get/" + userId, requestOptions)
        .then(
          response => {
            if (!response.ok) {
              throw new Error(response.status);
            }
            else return response.json();
          }
        )
    }
    
    static async loginUser(email) {
        var requestOptions = {
            method: 'GET',
            headers: {"Content-Type": "application/json", "credentials": 'same-origin'},
            redirect: 'follow'
          };
          
          return fetch(baseUrl + "/user/login/" + email, requestOptions)
            .then(
              response => {
                if (!response.ok) {
                  throw new Error(response.status);
                }
                else return response.json();
              }
            )
    }
    
    static async getProfileProgress(userId){
      if (userId === "") {
        return 0;
      }
      var requestOptions = {
          method: 'GET',
          headers: {"Content-Type": "application/json", "credentials": 'same-origin'},
          redirect: 'follow'
        };
        
      return fetch(baseUrl + "/user/profile/progress/" + userId, requestOptions)
        .then(
          response => {
            if (!response.ok) {
              throw new Error(response.status);
            }
            else return response.json();
          }
        )
    }
      
    static async getAvatarPoints(userId){
      if (userId === "") {
        return 0;
      }
        var requestOptions = {
            method: 'GET',
            headers: {"Content-Type": "application/json", "credentials": 'same-origin'},
            redirect: 'follow'
        };
    
        return fetch(baseUrl + "/points/get/" + userId, requestOptions)
          .then(
            response => {
              if (!response.ok) {
                throw new Error(response.status);
              }
              else return response.json();
            }
          )
    }

    static async getAllAvatars(){
      var requestOptions = {
        method: 'GET',
        headers: {"Content-Type": "application/json", "credentials": 'same-origin'},
        redirect: 'follow'
      };
      
      return fetch(baseUrl + "/avatar/get/all/", requestOptions)
        .then(
          response => {
            if (!response.ok) {
              throw new Error(response.status);
            }
            else {
              log_with_time("avatars have been retrieved");
              return response.json();
            }
          }
        )
    }

    static async getAllUsers(){
      var requestOptions = {
        method: 'GET',
        headers: {"Content-Type": "application/json", "credentials": 'same-origin'},
        redirect: 'follow'
      };
      
      return fetch(baseUrl + "/user/all/", requestOptions)
        .then(
          response => {
            if (!response.ok) {
              throw new Error(response.status);
            }
            else return response.json();
          }
        )
  }
      
    static async changeProfile(userId, profile){

      if (userId === "") {
        return {};
      }
    
        var raw = JSON.stringify(profile);
    
        var requestOptions = {
            method: 'POST',
            headers: {"Content-Type": "application/json", "credentials": 'same-origin'},
            body: raw,
            redirect: 'follow'
        };
    
        return fetch(baseUrl + "/user/profile/update/" + userId, requestOptions)
          .then(
            response => {
              if (!response.ok) {
                throw new Error(response.status);
              }
              else return response.json();
            }
          )
    }
    
    static async getAvatarOfUser(userId){
      if (userId === "") {
        return ({});
      }
        var requestOptions = {
          method: 'GET',
          headers: {"Content-Type": "application/json", "credentials": 'same-origin'},
          redirect: 'follow'
        };
        
        return fetch(baseUrl + "/avatar/get/" + userId, requestOptions)
          .then(
            response => {
              if (!response.ok) {
                throw new Error(response.status);
              }
              else return response.json();
            }
          )
      }
      
    static async changeAvatarLook(userId, avatar){

      if (userId === ""){
        return {};
      }
    
        var raw = JSON.stringify(avatar);
    
        var requestOptions = {
            method: 'POST',
            headers: {"Content-Type": "application/json", "credentials": 'same-origin'},
            body: raw,
            redirect: 'follow'
        };
    
        return fetch(baseUrl + "/avatar/change/" + userId, requestOptions)
          .then(
            response => {
              if (!response.ok) {
                throw new Error(response.status);
              }
              else return response.json();
            }
          )
    }
    
    static async getBuyableItems(){
        var requestOptions = {
          method: 'GET',
          headers: {"Content-Type": "application/json", "credentials": 'same-origin'},
          redirect: 'follow'
        };
        
        return fetch(baseUrl + "/items/buyable/", requestOptions)
          .then(
            response => {
              if (!response.ok) {
                throw new Error(response.status);
              }
              else return response.json();
            }
          )
      }

    static async getUserItems(userId) {

      if (userId === "") {
        return [];
      }
      
      var requestOptions = {
        method: 'GET',
        headers: {"Content-Type": "application/json", "credentials": 'same-origin'},
        redirect: 'follow'
      };
      
      return fetch(baseUrl + "/avatar/userItems/" + userId, requestOptions)
        .then(
          response => {
            if (!response.ok) {
              throw new Error(response.status);
            }
            else return response.json();
          }
        )
    }

    static async getEquippedItems(userId) {
      if (userId === "") {
        return {};
      }
      var requestOptions = {
        method: 'GET',
        headers: {"Content-Type": "application/json", "credentials": 'same-origin'},
        redirect: 'follow'
      };
      
      return fetch(baseUrl + "/avatar/get/equipped/" + userId, requestOptions)
        .then(
          response => {
            if (!response.ok) {
              throw new Error(response.status);
            }
            else return response.json();
          }
        )
    }

    static async equipAvatarItem(itemId, userId) {

      if (userId === "") {
        return {}
      }
    
      var requestOptions = {
          method: 'POST',
          headers: {"Content-Type": "application/json", "credentials": 'same-origin'},
          redirect: 'follow'
      };
  
      return fetch(baseUrl + "/avatar/equipItem/" + itemId + "/of/" + userId, requestOptions)
        .then(
          response => {
            if (!response.ok) {
              throw new Error(response.status);
            }
            else return response.json();
          }
        )
    }

    
    static async unequipAvatarItem(kind, userId) {

      if (userId === "") {
        return {}
      }
    
      var requestOptions = {
          method: 'POST',
          headers: {"Content-Type": "application/json", "credentials": 'same-origin'},
          redirect: 'follow'
      };
  
      return fetch(baseUrl + "/avatar/unequipItem/" + kind.toLowerCase() + "/of/" + userId, requestOptions)
        .then(
          response => {
            if (!response.ok) {
              throw new Error(response.status);
            }
            else return response.json();
          }
        )
    }
    
    static async buyItem (userId, itemId) {
      if (userId === "") {
        return {};
      }
        var requestOptions = {
            method: 'POST',
            headers: {"Content-Type": "application/json", "credentials": 'same-origin'},
            redirect: 'follow'
        };
        
        return fetch(baseUrl + "/avatar/buy/" + itemId + "/as/" + userId, requestOptions)
          .then(
            response => {
              if (!response.ok) {
                throw new Error(response.status);
              }
              else return response.json();
            }
          )
    }
    
    static async addTask(userId, projectId, task){

      if (userId === "") {
        return {};
      }
    
        var raw = JSON.stringify({
          state: task.state,
          name: task.name,
          description: task.description,
          deadline: task.deadline
        });
        
        var requestOptions = {
            method: 'PUT',
            headers: {"Content-Type": "application/json", "credentials": 'same-origin'},
            body: raw,
            redirect: 'follow'
        };
        
        fetch(baseUrl + "/task/create/from/" + userId + "/in/" + projectId, requestOptions)
          .then(
            response => {
              if (!response.ok) {
                throw new Error(response.status);
              }
              else return response.json();
            }
          )
    }

    static async changeTask(taskId, task){
    
      var raw = JSON.stringify({
        state: task.state,
        name: task.name,
        description: task.description,
        deadline: task.deadline
      });
      
      var requestOptions = {
          method: 'POST',
          headers: {"Content-Type": "application/json", "credentials": 'same-origin'},
          body: raw,
          redirect: 'follow'
      };
      
      fetch(baseUrl + "/task/update/" + taskId, requestOptions)
        .then(
          response => {
            if (!response.ok) {
              throw new Error(response.status);
            }
            else return response.json();
          }
        )
  }
    
    static async getProjects(){
        var requestOptions = {
            method: 'GET',
            headers: {"Content-Type": "application/json", "credentials": 'same-origin'},
            redirect: 'follow'
          };
          
          return fetch(baseUrl + "/project/all", requestOptions)
            .then(
              response => {
                if (!response.ok) {
                  throw new Error(response.status);
                }
                else return response.json();
              }
            )
    }

    static async createProject(name, description, userId) {

      if (userId === "") {
        return {};
      }
      var raw = JSON.stringify({
        name: name,
        description: description
      });

      var requestOptions = {
        method: 'PUT',
        headers: {"Content-Type": "application/json", "credentials": 'same-origin'},
        body: raw,
        redirect: 'follow'
      };

      return fetch(baseUrl + "/project/create/" + userId, requestOptions)
        .then(
          // TODO add error in backend for max number of projects
          response => {
            if (!response.ok) {
              throw new Error(response.status);
            }
            else return response.json();
          }
        )
    }

    static async joinProject(projectId, userId){

      if (userId === "") {
        return {};
      }
        
        var requestOptions = {
            method: 'POST',
            headers: {"Content-Type": "application/json", "credentials": 'same-origin'},
            redirect: 'follow'
          };
          
          fetch(baseUrl + "/project/join/project/" + projectId + "/as/" + userId, requestOptions)
            .then(
              response => {
                if (!response.ok) {
                  throw new Error(response.status);
                }
                else return response.json();
              }
            )
    }
    
    static async getProjectTasks(projectId){
        var requestOptions = {
          method: 'GET',
          headers: {"Content-Type": "application/json", "credentials": 'same-origin'},
          redirect: 'follow'
        };
        
        return fetch(baseUrl + "/tasks/of/project/" + projectId, requestOptions)
          .then(
            response => {
              if (!response.ok) {
                throw new Error(response.status);
              }
              else return response.json();
            }
          )
    }
    
    static async likeTask(taskId, userId){

      if (userId === "") {
        return {};
      }
        var raw = "";
        
        var requestOptions = {
            method: 'POST',
            headers: {"Content-Type": "application/json", "credentials": 'same-origin'},
            body: raw,
            redirect: 'follow'
        };
        
        fetch(baseUrl + "/task/like/" + taskId + "/liker/" + userId, requestOptions)
          .then(
            response => {
              if (!response.ok) {
                throw new Error(response.status);
              } else {
                // DO something
              }
            }
          )
    }

    static async unlikeTask(taskId, userId){

      if (userId === "") {
        return {};
      }
      var raw = "";
      
      var requestOptions = {
          method: 'POST',
          headers: {"Content-Type": "application/json", "credentials": 'same-origin'},
          body: raw,
          redirect: 'follow'
      };
      
      fetch(baseUrl + "/task/unlike/" + taskId + "/disliker/" + userId, requestOptions)
      .then(
        response => {
          if (!response.ok) {
            throw new Error(response.status);
          } else {
            // DO something
          }
        }
      )
  }

    static async createNewItem(item) {

      var raw = JSON.stringify(item);

      console.log(item);
      var requestOptions = {
        method: 'PUT',
        headers: {"Content-Type": "application/json", "credentials": 'same-origin'},
        body: raw,
        redirect: 'follow'
      };

      return fetch(baseUrl + "/item/add", requestOptions)
        .then(
          response => {
            console.log(response);
            if (!response.ok) {
              throw new Error(response.status);
            }
            else {
              return response.text();
            }
          }
        )
    }

    static async getProjectStatistics(projectId) {
      var requestOptions = {
        method: 'GET',
        headers: {"Content-Type": "application/json", "credentials": 'same-origin'},
        redirect: 'follow'
      };
      
      return fetch(baseUrl + "/statistics/get/" + projectId, requestOptions)
        .then(
          response => {
            if (!response.ok) {
              throw new Error(response.status);
            }
            else return response.json();
          }
        )
    }

    static async getStatistics() {
      var requestOptions = {
        method: 'GET',
        headers: {"Content-Type": "application/json", "credentials": 'same-origin'},
        redirect: 'follow'
      };
      
      return fetch(baseUrl + "/statistics/get/all", requestOptions)
        .then(
          response => {
            if (!response.ok) {
              throw new Error(response.status);
            }
            else return response.json();
          }
        )
    }

    static async getGamificationStatistics() {
      var requestOptions = {
        method: 'GET',
        headers: {"Content-Type": "application/json", "credentials": 'same-origin'},
        redirect: 'follow'
      };
      
      return fetch(baseUrl + "/statistics/get/gamified", requestOptions)
        .then(
          response => {
            if (!response.ok) {
              throw new Error(response.status);
            }
            else return response.json();
          }
        )
    }

    static async getAllItems() {
      var requestOptions = {
        method: 'GET',
        headers: {"Content-Type": "application/json", "credentials": 'same-origin'},
        redirect: 'follow'
      };
      
      return fetch(baseUrl + "/items/all", requestOptions)
        .then(
          response => {
            if (!response.ok) {
              throw new Error(response.status);
            }
            else return response.json();
          }
        )
    }

    static async getAllUserChallenges() {
      var requestOptions = {
        method: 'GET',
        headers: {"Content-Type": "application/json", "credentials": 'same-origin'},
        redirect: 'follow'
      };
      
      return fetch(baseUrl + "/userChallenge/get/all", requestOptions)
        .then(
          response => {
            if (!response.ok) {
              throw new Error(response.status);
            }
            else return response.json();
          }
        )
    }

    static async getParticipatedUserForUC(challengeId) {
      var requestOptions = {
        method: 'GET',
        headers: {"Content-Type": "application/json", "credentials": 'same-origin'},
        redirect: 'follow'
      };
      
      return fetch(baseUrl + "/userChallenge/usersParticipated/" + challengeId, requestOptions)
        .then(
          response => {
            if (!response.ok) {
              throw new Error(response.status);
            }
            else return response.json();
          }
        )
    }

    static async deactivateChallenge(challengeId) {
      
      var requestOptions = {
          method: 'POST',
          headers: {"Content-Type": "application/json", "credentials": 'same-origin'},
          redirect: 'follow'
      };
      
      fetch(baseUrl + "/userChallenge/deactivate/" + challengeId, requestOptions)
        .then(
          response => {
            if (!response.ok) {
              throw new Error(response.status);
            }
            else return response.json();
          }
        )
    }

    static async activateChallenge(challengeId) {
      
      var requestOptions = {
          method: 'POST',
          headers: {"Content-Type": "application/json", "credentials": 'same-origin'},
          redirect: 'follow'
      };
      
      fetch(baseUrl + "/userChallenge/activate/" + challengeId, requestOptions)
        .then(
          response => {
            if (!response.ok) {
              throw new Error(response.status);
            }
            else return response.json();
          }
        )
    }

    static async createGroupChallenge(groupChallenge) {
      var raw = JSON.stringify(groupChallenge);

      var requestOptions = {
        method: 'PUT',
        headers: {"Content-Type": "application/json", "credentials": 'same-origin'},
        body: raw,
        redirect: 'follow'
      };

      return fetch(baseUrl + "/groupChallenge/set", requestOptions)
        .then(
          response => {
            if (!response.ok) {
              throw new Error(response.status);
            }
            else return response.text();
          }
        )
    }

    static async getGroupChallenges() {
      
      var requestOptions = {
        method: 'GET',
        headers: {"Content-Type": "application/json", "credentials": 'same-origin'},
        redirect: 'follow'
      };
      
      return fetch(baseUrl + "/groupChallenge/get/all", requestOptions)
        .then(
          response => {
            if (!response.ok) {
              throw new Error(response.status);
            }
            else return response.json();
          }
        )
    }

    static async getActiveGroupChallenges() {
      
      var requestOptions = {
        method: 'GET',
        headers: {"Content-Type": "application/json", "credentials": 'same-origin'},
        redirect: 'follow'
      };
      
      return fetch(baseUrl + "/groupChallenge/get/active", requestOptions)
        .then(
          response => {
            if (!response.ok) {
              throw new Error(response.status);
            }
            else return response.json();
          }
        )
    }

    static async deactivateGroupChallenge(challengeId) {
      
      var requestOptions = {
          method: 'POST',
          headers: {"Content-Type": "application/json", "credentials": 'same-origin'},
          redirect: 'follow'
      };
      
      fetch(baseUrl + "/groupChallenge/deactivate/" + challengeId, requestOptions)
      .then(
        response => {
          if (!response.ok) {
            throw new Error(response.status);
          }
        }
      )
    }

    static async activateGroupChallenge(challengeId) {
      
      var requestOptions = {
          method: 'POST',
          headers: {"Content-Type": "application/json", "credentials": 'same-origin'},
          redirect: 'follow'
      };
      
      fetch(baseUrl + "/groupChallenge/activate/" + challengeId, requestOptions)
        .then(
          response => {
            console.log(response);
            if (!response.ok) {
              throw new Error(response.status);
            }
          }
        )
    }
}

export default FetchClass;