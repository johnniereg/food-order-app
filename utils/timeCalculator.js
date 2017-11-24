module.exports = function(db){
  const timeCalculator = (id)=>{
    return new Promise((resolve, reject) => {
      db('orders').select()
        .where('id', id)
        .then( order => {
          let ordertime = order[0].time_accepted;
          if(!order){
            return resolve(null);
          }
          let diff = order[0].order_time-Math.floor((Date.now()-ordertime.getTime() )/1000/60);
          return resolve(diff);
        })
        .catch( err => {
          reject(err);
        });
    });
  };
  return {
    timeCalculator
  };
};
