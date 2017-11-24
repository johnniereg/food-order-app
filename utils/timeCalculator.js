module.exports = function(db){
  const timeCalculator = (id,$jqueryobject)=>{
    /*return new Promise
    select*from orders where id = id then (result)=>{
      let timetoorder = date.now-result.date +result.order_time
      if(timetoorder>0){
        $queryobject.append(timetoorder)
      }else{
        $queryobject.append("Order ready for pickup!");
      }
    }*/
    return new Promise((resolve, reject) => {
      db('orders').select()
        .where('id', id)
        .then( order => {
          let ordertime = order[0].time_accepted;
          let diff = order[0].order_time-Math.floor((Date.now()-ordertime.getTime() )/1000/60)
          //ordertime.split(" ");
          //console.log(diff);
          if($jqueryobject){
            if(diff>0){
              $jqueryobject.append("<div>Your order will be ready in "+diff+" minutes</div>");
            }else{
              $jqueryobject.append("<div>Your is ready!</div>");
            }
          }else{
            console.log(diff);
          }
        })
        .catch( err => {
          reject(err);
        });
    });
  
  }
  
  
  
  return {
    timeCalculator
  }
}