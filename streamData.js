var SensorTag = require('sensortag');
var Readable = require('stream').Readable;
var plotly = require('plotly')('AdamAID','Xj4MtuE0NDh37URE9PlR');
var connected = false;

var data = [{x:[], y:[], z:[], stream:{token:'oab5mxhox0', maxpoints:20}, mode: "lines",
  marker: {
    size: 12,
    line: {
      color: "rgba(217, 217, 217, 0.14)",
      width: 0.5
    },
    opacity: 0.8
  },
  type: "scatter3d"
}];

var layout = {
  autosize: false,
  width: 5,
  height: 5,
  margin: {
    l: 0,
    r: 0,
    b: 0,
    t: 0
  }
};

var graphOptions = {layout: layout, filename: "sensorTagLinesFixed", fileopt: "overwrite"};

var dataStream = new Readable;
dataStream._read = function noop() {};

plotly.plot(data, graphOptions, function() {
  var plotStream = plotly.stream('oab5mxhox0', function (res) {
    console.log(res);
  });
  dataStream.pipe(plotStream);

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
        "t" : counter;
        "x" : x,
        "y" : y,
        "z" : z
      };
      counter = counter + 1;
      console.log("accelerometer: " + JSON.stringify(data))
      dataStream.push(JSON.stringify(data)+'\n');
    });

    sensorTag.on('magnetometerChange', function(x, y, z) {
      var data = {
        "x" : x,
        "y" : y,
        "z" : z
      };
      console.log("magnetometer: " + JSON.stringify(data))
//      dataStream.push(JSON.stringify(data)+'\n');
    });

    sensorTag.on('gyroscopeChange', function(x, y, z) {
      var data = {
        "x" : x,
        "y" : y,
        "z" : z
      };
      console.log("gyroscopeChange" + JSON.stringify(data))
      // dataStream.push(JSON.stringify(data)+'\n');
    });

    var previousClick = {"left" : false, "right" : false};
    sensorTag.on('simpleKeyChange', function(left, right) {
      var data = {
        "d": {
          "type": "simpleKey",
          "left" : false,
          "right" : false
        }
      };
      if(!previousClick.left && !previousClick.right) {
        previousClick.left = left;
        previousClick.right = right;
        return;
      }
      if(previousClick.right && previousClick.left && !left && !right) {
        data.d.right = true;
        data.d.left = true;
      }
      if(previousClick.left && !left) {
        data.d.left = true;
      }
      if(previousClick.right && !right) {
        data.d.right = true;
      }

      previousClick.left = false;
      previousClick.right = false;
      console.log(data);
    });

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
