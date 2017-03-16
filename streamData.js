var SensorTag = require('sensortag');
var Readable = require('stream').Readable;
var plotly = require('plotly')('AdamAID','Xj4MtuE0NDh37URE9PlR');
var connected = false;

var data = [{y:[], x:[], stream:{token:'oab5mxhox0', maxpoints:200}, mode: "lines",
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
}];

var layout = {
  autosize: true,
};

var graphOptions = {layout: layout, filename: "sensorTagLines2D1", fileopt: "overwrite"};

var dataStream1 = new Readable;
dataStream1._read = function noop() {};
var dataStream2 = new Readable;
dataStream2._read = function noop() {};
var dataStream3 = new Readable;
dataStream3._read = function noop() {};

plotly.plot(data, graphOptions, function(err, res) {
  if (err) return console.log("ERROR", err);
  console.log(res);

  var plotStream1 = plotly.stream('oab5mxhox0', function (res) {
    console.log(res);
  });
  dataStream1.pipe(plotStream1);

  var plotStream2 = plotly.stream('zsh9s2bzmq', function (res) {
    console.log(res);
  });
  dataStream2.pipe(plotStream2);

  var plotStream3 = plotly.stream('don4j34u6h', function (res) {
    console.log(res);
  });
  dataStream3.pipe(plotStream3);

  console.log('Make sure the SensorTag is on!');

  SensorTag.discover(function(sensorTag) {

    console.log('Discovered SensorTag with UUID: ' + sensorTag['uuid']);

    sensorTag.connectAndSetUp(function(err) {
      if (err) throw err;
      connected = true;
      console.log('Connected To SensorTag');
      getDeviceInfo();
      initAccelAndGyro();
      initKeys();
    });

    sensorTag.on('disconnect', function(onDisconnect) {
      connected = false;
      console.log('SensorTag disconnected.');
    });

    var counter = 0;

    sensorTag.on('accelerometerChange', function(x, y, z) {
      var data = {
        "t" : counter,
        "x" : x,
        "y" : y,
        "z" : z
      };
      // console.log("accelerometer: " + JSON.stringify({"x1": x, "t": counter}))
      // console.log("accelerometer: " + JSON.stringify({"x2": y, "t": counter}))
      // console.log("accelerometer: " + JSON.stringify({"x3": z, "t": counter}))
      counter = counter + 1;
      dataStream1.push(JSON.stringify({"x": counter, "y": x})+'\n');
      dataStream2.push(JSON.stringify({"x": counter, "y": y})+'\n');
      dataStream3.push(JSON.stringify({"x": counter, "y": z})+'\n');
    });

//     sensorTag.on('magnetometerChange', function(x, y, z) {
//       var data = {
//         "x" : x,
//         "y" : y,
//         "z" : z
//       };
//       console.log("magnetometer: " + JSON.stringify(data))
// //      dataStream.push(JSON.stringify(data)+'\n');
//     });
//
//     sensorTag.on('gyroscopeChange', function(x, y, z) {
//       var data = {
//         "x" : x,
//         "y" : y,
//         "z" : z
//       };
//       console.log("gyroscopeChange" + JSON.stringify(data))
//       // dataStream.push(JSON.stringify(data)+'\n');
//     });
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
      // sensorTag.enableGyroscope(logDeviceInfo);
      // sensorTag.notifyGyroscope(logDeviceInfo);
      // sensorTag.enableMagnetometer(logDeviceInfo);
      // sensorTag.notifyMagnetometer(logDeviceInfo);
    };

  });
});
