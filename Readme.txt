
1. go to root folder,  remove "node_mdules" folder and package-lock.json file. and run "npm install"
2. for android , run "react-native run-android" for ios, run "react-native run-ios"
   or need to open the android app using android studio and ios app using xcode.

   for ios, before opening the source using xcode, need to do "pod install"  ( rmeove pod folder and  run "pod install")



 for local running, need to change the base ip address.
 you will find  ADDRESS:"http://192.168.1.120:8001" in constants.js file under src/config
 need to change this ip address with local computer ip address.




For removing the warning..
in react_native/libraries/logbox/data/logboxdata.js
rename componentWillUnmount to UNSAFE_componentWillUnmount
componentDidMount to UNSAFE_componentDidMount

 


 

For business api

in order to check in  (update QBASED_checkin_time). Call following api.
Api Method: POST
Api URL  : 192.168.1.116:8001/checkin  ( BASE url + "/" + checkin )
Parameter : Body in Json format
            {
              "slot_id":"76"
            }
Response :
Success => 
{
    "msg": "success",
    "status": 200
}



in order to check out (update QBASED_checkout_time and move the queue positions.. ) Call following api.
Api Method : POST 
Api URL : 192.168.1.116:8001/closequeue 
Parameter : Body in json format
            {
              "slot_id":"76"
            }
Success =>
{
    "difference": 10,
    "msg": "success",
    "status": 200
}

difference is the shift between checkin time and checkout .
It will be used for calculating the average waiting time.
for now, it is calculating the average time.. and update The QUEUE_avg_waiting_tiem.


You can use postman  program for it.
https://drive.google.com/file/d/1bd7w-NxzMUQffFOJsFvbFDX-TWonKpzo/view?usp=sharing
This image show you how to call the api using postman program. 
Thank you
