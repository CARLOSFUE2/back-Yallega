const webPush = require('web-push');
 
const publicKey="BL_91K5KVgh5AzNAfx1Lgv3OSpmrf8yC2fh5z3jMjNwNH9Uo6zB77_m1gnozKhGLfdbHC2EIMvFm-9lLzGgJXzI";
const privateKey="Y79TxyWI02uJf64No8QRMpX3nsyw-4ouMtwh73wT2qg"

const sub = {
    "endpoint":"https://fcm.googleapis.com/fcm/send/cPrypVLakMo:APA91bEohVU0TKM5f2aWvDm0irTiZOIcVgWuHphzy5sOJ1JHZ5gFdWWVgDwZmH4_m-tWwCAbovC0jB3l_NWAJ8y8ysAF4a0tjP4BcIQBetIbhkVcbwjUKdEjX0zNzQDNOD6bjDpw3DLC",
    "expirationTime":null,
    "keys":
        {
            "p256dh":"BExg-vmhOyXjCY9Wf8SbXUuow28i_iJuZO4ShZ-YJt0B5HGwTb5JImTVSxcbZdkwv2EFP7NMSgo0HB7wP_LARI4",
            "auth":"ru-pZee4yyyNDa0wcFA4cw"
        }
}
const sub2 = {
    "endpoint":"https://updates.push.services.mozilla.com/wpush/v2/gAAAAABhL…U9Vva0Lrbsyy1GnLuCUwDlHstu4Ctt1DIybRx9KyA5XBJPwyCOwKyZmP3BTo",
    "keys":{
    "auth":"8_Vj6kcVJhJM8hOOsm7kJQ",
    "p256dh":"BOfK8sDQyp6wR6uYs-cja3KQVISn5cWL5P4btvo31aUKNQpJElnd9mExjGpiyYt0B05udDSdpM3TGAjGekktl3s"}
    }


    

    const notificationPayload = {
        notification: {
            title: "Angular News",
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: 1
            },
 
        }
   };

   webPush.setVapidDetails(
    'mailto:yallega.cl@gmail.com',
    publicKey,
    privateKey
  )
  
   function notification (){
     webPush.sendNotification(sub2,JSON.stringify(notificationPayload)).then(
         (resp) => console.log(resp)).catch((err)=>{
             console.log('error',err);
         })
   }

 module.exports = {notification};