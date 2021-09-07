const axios = require('axios');


const serverKey ='AAAANwTNlM4:APA91bGjXg-nbrb5O0WH8I0cJXj4-b3_2w_oOuhoDJ8QjmySQ7gc7p1cwGSrSrvm3e5B4aUaaTVAh6DoerviIBBTtWY7_eVtfTuomcrw8556fhZonqemNyqx_2bA7Fuo_wech1gWmecw';

async function sendNotification(list){
    try{
    list.forEach(async (token) => {        
        let response = await axios.post(' https://fcm.googleapis.com/fcm/send', {
             "to" : token,
             "notification" : {
                 "body" : "nuevo pedido diponible",
                 "title": "Ya llega"
             }
            }, {
             headers: {
             'Content-Type': 'application/json',
             'Authorization': 'key = ' + serverKey 
             }
           }
         )
         console.log('notificacion')
    });

    }catch(err){
        console.log('error de notificacion', err)
    }
}

module.exports = { sendNotification}