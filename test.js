tester();

function tester() {

  console.log('Starting test');

  doSomething(4, function () {
    console.log("Still here");
  });
  //, function() {
    //if (err) throw err
    //console.log(err);
    //console.log("got back: " + data)
  //});

}

function doSomething(data, callback) {
  //console.log("doing: " + data);
  console.log("doingSomethign");
  callback(data);
}
