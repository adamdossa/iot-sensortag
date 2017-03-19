var SensorTag = require('sensortag');
var Readable = require('stream').Readable;
var plotly = require('plotly')('AdamAID','FY6NY09F0PC4Pitn23Jx');
var KalmanFilter = require('kalmanjs').default;
var connected = false;

var data1 = [{y:[], x:[], stream:{token:'oab5mxhox0', maxpoints:200}, mode: "lines",
  yaxis: "y",
  visible: true,
  mode: "lines",
  xaxis: "x",
  type: "scatter",
  name: "x"
}, {y:[], x:[], stream:{token:'zsh9s2bzmq', maxpoints:200}, mode: "lines",
  yaxis: "y",
  visible: true,
  mode: "lines",
  xaxis: "x",
  type: "scatter",
  name: "y"
}, {y:[], x:[], stream:{token:'don4j34u6h', maxpoints:200}, mode: "lines",
  yaxis: "y",
  visible: true,
  mode: "lines",
  xaxis: "x",
  type: "scatter",
  name: "z"
},
name='accelerometerWithKalman'];

var data2 = [{y:[], x:[], stream:{token:'l6glf28ilf', maxpoints:200}, mode: "lines",
  yaxis: "y2",
  visible: true,
  mode: "lines",
  xaxis: "x2",
  type: "scatter",
  name: "x"
}, {y:[], x:[], stream:{token:'5pjuhu9t3y', maxpoints:200}, mode: "lines",
  yaxis: "y2",
  visible: true,
  mode: "lines",
  xaxis: "x2",
  type: "scatter",
  name: "y"
}, {y:[], x:[], stream:{token:'d54bx8kyzb', maxpoints:200}, mode: "lines",
  yaxis: "y2",
  visible: true,
  mode: "lines",
  xaxis: "x2",
  type: "scatter",
  name: "z"
},
name='magnetometerWithKalman'];

var data3 = [{y:[], x:[], stream:{token:'eqg1tt3yl1', maxpoints:200}, mode: "lines",
  yaxis: "y3",
  visible: true,
  mode: "lines",
  xaxis: "x3",
  type: "scatter",
  name: "x"
}, {y:[], x:[], stream:{token:'brs5umhc1z', maxpoints:200}, mode: "lines",
  yaxis: "y3",
  visible: true,
  mode: "lines",
  xaxis: "x3",
  type: "scatter",
  name: "y"
}, {y:[], x:[], stream:{token:'vnw9ya6kkg', maxpoints:200}, mode: "lines",
  yaxis: "y3",
  visible: true,
  mode: "lines",
  xaxis: "x3",
  type: "scatter",
  name: "z"
},
name='gyroscopeWithKalman'];

var data = [data1, data2, data3];

var layout = {
  yaxis: {domain: [0, 0.266]},
  xaxis3: {anchor: "y3"},
  xaxis2: {anchor: "y2"},
  yaxis2: {domain: [0.366, 0.633]},
  yaxis3: {domain: [0.733, 1]},
  legend: {traceorder: "reversed"},
  autosize: true,
};

var graphOptions = {layout: layout, filename: "accelerometerWithKalman", fileopt: "overwrite"};

var dataStream11 = new Readable;
dataStream11._read = function noop() {};
var dataStream21 = new Readable;
dataStream21._read = function noop() {};
var dataStream31 = new Readable;
dataStream31._read = function noop() {};
var dataStream12 = new Readable;
dataStream12._read = function noop() {};
var dataStream22 = new Readable;
dataStream22._read = function noop() {};
var dataStream32 = new Readable;
dataStream32._read = function noop() {};
var dataStream13 = new Readable;
dataStream13._read = function noop() {};
var dataStream23 = new Readable;
dataStream23._read = function noop() {};
var dataStream33 = new Readable;
dataStream33._read = function noop() {};
var kf11 = new KalmanFilter({R: 1, Q: 10});
var kf21 = new KalmanFilter({R: 1, Q: 10});
var kf31 = new KalmanFilter({R: 1, Q: 10});
var kf12 = new KalmanFilter({R: 1, Q: 10});
var kf22 = new KalmanFilter({R: 1, Q: 10});
var kf32 = new KalmanFilter({R: 1, Q: 10});
var kf13 = new KalmanFilter({R: 1, Q: 10});
var kf23 = new KalmanFilter({R: 1, Q: 10});
var kf33 = new KalmanFilter({R: 1, Q: 10});

plotly.plot(data, graphOptions, function(err, res) {
  if (err) return console.log("ERROR", err);
  console.log(res);

  var plotStream11 = plotly.stream('oab5mxhox0', function (res) {
    console.log(res);
  });
  dataStream11.pipe(plotStream11);

  var plotStream21 = plotly.stream('zsh9s2bzmq', function (res) {
    console.log(res);
  });
  dataStream21.pipe(plotStream21);

  var plotStream31 = plotly.stream('don4j34u6h', function (res) {
    console.log(res);
  });
  dataStream31.pipe(plotStream31);

  var plotStream12 = plotly.stream('l6glf28ilf', function (res) {
    console.log(res);
  });
  dataStream12.pipe(plotStream12);

  var plotStream22 = plotly.stream('5pjuhu9t3y', function (res) {
    console.log(res);
  });
  dataStream22.pipe(plotStream22);

  var plotStream32 = plotly.stream('d54bx8kyzb', function (res) {
    console.log(res);
  });
  dataStream32.pipe(plotStream32);

  var plotStream13 = plotly.stream('eqg1tt3yl1', function (res) {
    console.log(res);
  });
  dataStream13.pipe(plotStream13);

  var plotStream23 = plotly.stream('brs5umhc1z', function (res) {
    console.log(res);
  });
  dataStream23.pipe(plotStream23);

  var plotStream33 = plotly.stream('vnw9ya6kkg', function (res) {
    console.log(res);
  });
  dataStream33.pipe(plotStream33);

  console.log('Make sure the SensorTag is on!');

  SensorTag.discover(function(sensorTag) {

    console.log('Discovered SensorTag with UUID: ' + sensorTag['uuid']);

    sensorTag.connectAndSetUp(function(err) {
      if (err) throw err;
      connected = true;
      console.log('Connected To SensorTag');
      // getDeviceInfo();
      initAccelAndGyro();
      // initKeys();
    });

    sensorTag.on('disconnect', function(onDisconnect) {
      connected = false;
      console.log('SensorTag disconnected.');
    });

    var counterAcc = 0;
    var counterMag = 0;
    var counterGyro = 0;

    sensorTag.on('accelerometerChange', function(x, y, z) {
      var data = {
        "t" : counterAcc,
        "x" : x,
        "y" : y,
        "z" : z
      };
      console.log("accelerometer: " + JSON.stringify({"x1": x, "t": counterAcc}))
      console.log("accelerometer: " + JSON.stringify({"x2": y, "t": counterAcc}))
      console.log("accelerometer: " + JSON.stringify({"x3": z, "t": counterAcc}))
      counterAcc = counterAcc + 1;
      dataStream11.push(JSON.stringify({"x": counterAcc, "y": kf11.filter(x)})+'\n');
      dataStream21.push(JSON.stringify({"x": counterAcc, "y": kf21.filter(y)})+'\n');
      dataStream31.push(JSON.stringify({"x": counterAcc, "y": kf31.filter(z)})+'\n');
      // dataStream1.push(JSON.stringify({"x": counter, "y": x})+'\n');
      // dataStream2.push(JSON.stringify({"x": counter, "y": y})+'\n');
      // dataStream3.push(JSON.stringify({"x": counter, "y": z})+'\n');
      // dataStream2.push(JSON.stringify({"x": counter, "y": kf2.filter(y)})+'\n');
      // dataStream3.push(JSON.stringify({"x": counter, "y": kf3.filter(z)})+'\n');
    });

    sensorTag.on('magnetometerChange', function(x, y, z) {
      var data = {
        "t" : counterMag,
        "x" : x,
        "y" : y,
        "z" : z
      };
      console.log("magnetometer: " + JSON.stringify({"x1": x, "t": counterMag}))
      console.log("magnetometer: " + JSON.stringify({"x2": y, "t": counterMag}))
      console.log("magnetometer: " + JSON.stringify({"x3": z, "t": counterMag}))
      counterMag = counterMag + 1;
      dataStream12.push(JSON.stringify({"x": counterMag, "y": kf12.filter(x)})+'\n');
      dataStream22.push(JSON.stringify({"x": counterMag, "y": kf22.filter(y)})+'\n');
      dataStream32.push(JSON.stringify({"x": counterMag, "y": kf32.filter(z)})+'\n');
    });

    sensorTag.on('gyroscopeChange', function(x, y, z) {
      var data = {
        "t" : counterGyro,
        "x" : x,
        "y" : y,
        "z" : z
      };
      console.log("gyroscope: " + JSON.stringify({"x1": x, "t": counterGyro}))
      console.log("gyroscope: " + JSON.stringify({"x2": y, "t": counterGyro}))
      console.log("gyroscope: " + JSON.stringify({"x3": z, "t": counterGyro}))
      counterGyro = counterGyro + 1;
      dataStream12.push(JSON.stringify({"x": counterGyro, "y": kf13.filter(x)})+'\n');
      dataStream22.push(JSON.stringify({"x": counterGyro, "y": kf23.filter(y)})+'\n');
      dataStream32.push(JSON.stringify({"x": counterGyro, "y": kf33.filter(z)})+'\n');
    });
//
//     var previousClick = {"left" : false, "right" : false};
//     sensorTag.on('simpleKeyChange', function(left, right) {
//       var data = {
//         "d": {
//           "type": "simpleKey",
//           "left" : false,
//           "right" : false
//         }
//       };
//       if(!previousClick.left && !previousClick.right) {
//         previousClick.left = left;
//         previousClick.right = right;
//         return;
//       }
//       if(previousClick.right && previousClick.left && !left && !right) {
//         data.d.right = true;
//         data.d.left = true;
//       }
//       if(previousClick.left && !left) {
//         data.d.left = true;
//       }
//       if(previousClick.right && !right) {
//         data.d.right = true;
//       }
//
//       previousClick.left = false;
//       previousClick.right = false;
//       console.log(data);
//     });

    function logDeviceInfo(err, info) {
      if (err) {
        console.log("SensorTag Info Error: " + err);
      };

      if (info) {
        console.log("SensorTag Info: " + info);
      };
      // if (err) console.log("SensorTag Info Error: " + err);
      // console.log("SensorTag Info" + info);
    }

    function getDeviceInfo() {
      sensorTag.readDeviceName(logDeviceInfo);
      sensorTag.readSystemId(logDeviceInfo);
      sensorTag.readSerialNumber(logDeviceInfo);
      sensorTag.readFirmwareRevision(logDeviceInfo);
      sensorTag.readHardwareRevision(logDeviceInfo);
      sensorTag.readSoftwareRevision(logDeviceInfo);
      sensorTag.readManufacturerName(logDeviceInfo);
    }

    function initKeys() {
      sensorTag.notifySimpleKey(function(left, right) {
      });
    };

    function initAccelAndGyro() {
      sensorTag.enableAccelerometer(logDeviceInfo);
      sensorTag.notifyAccelerometer(logDeviceInfo);
      sensorTag.setAccelerometerPeriod(100, logDeviceInfo)
      sensorTag.enableGyroscope(logDeviceInfo);
      sensorTag.notifyGyroscope(logDeviceInfo);
      sensorTag.enableMagnetometer(logDeviceInfo);
      sensorTag.notifyMagnetometer(logDeviceInfo);
    };

  });
});
