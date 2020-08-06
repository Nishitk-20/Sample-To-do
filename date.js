

exports.getDate = function(){
let today = new Date();
let option = {
    weekday : "long",
    day : "numeric",
    month : "long"
};

return today.toLocaleDateString("en-US",option);
}

exports.getDay = function(){
    let today = new Date();
    let option = {
        weekday : "long"
    };
    
    return today.toLocaleDateString("en-US",option);
}

    // ///let currentDay = today.getDay();
    // let dayList = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    // let day = dayList[currentDay];
    // res.render("index.ejs",{
    //     TypeDay : day
    //  ///   })