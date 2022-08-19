const NativePage = require('./native.page.js');
const fs = require('fs');

//===================================================================================================================
//Author : Rashad 
//Date   : 22.06.2022
//====================================================================================================================

var startTime = 0;
var endTime = 0;

class commonMethods extends NativePage {

    /**
     * define selectors using getter methods
    **/

     getCurrentTime(position){
        var today = new Date();
        var time = today/1000
    
        if (position == "start"){
            startTime = time
        }else{
            endTime = time
        }
    }
    
      getExecutionTime(){
        console.log("substraction", endTime, " - ", startTime)
        var executionTime = endTime- startTime
        return executionTime;
    }
    
    
    //write json file
    async writeFile(executionTime){
      
        //create json object for execution time
        const newObject = {
            executionTime : executionTime,
        }
    
        fs.writeFile("./Data_Files/executionTime.json", JSON.stringify(newObject), err=>{
            if (err) {
                console.log(err)
            } else{
                console.log("succesfully saved")
            }
        })
    
    }


}module.exports = new commonMethods();