function getCurrentDate () {
    // returns current date in format yyyy-mm-dd
    const currentdate = new Date(); 
    const today =     currentdate.getFullYear() + "-"
                    + (currentdate.getMonth()+1)  + "-" 
                    + currentdate.getDate()
                    // + " "  
                    // + currentdate.getHours() + ":"  
                    // + (currentdate.getMinutes() < 10 ? "0"+currentdate.getMinutes() : currentdate.getMinutes())
    return today;
}

module.exports = getCurrentDate;