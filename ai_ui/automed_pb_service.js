// package: automed
// file: automed.proto

var automed_pb = require("./automed_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var AutomedService = (function () {
  function AutomedService() {}
  AutomedService.serviceName = "automed.AutomedService";
  return AutomedService;
}());

AutomedService.HealthCheck = {
  methodName: "HealthCheck",
  service: AutomedService,
  requestStream: false,
  responseStream: false,
  requestType: automed_pb.HealthCheckRequest,
  responseType: automed_pb.HealthCheckResponse
};

AutomedService.Predict = {
  methodName: "Predict",
  service: AutomedService,
  requestStream: false,
  responseStream: false,
  requestType: automed_pb.PredictRequest,
  responseType: automed_pb.PredictResponse
};

AutomedService.PredictBatch = {
  methodName: "PredictBatch",
  service: AutomedService,
  requestStream: false,
  responseStream: false,
  requestType: automed_pb.PredictBatchRequest,
  responseType: automed_pb.PredictBatchResponse
};

AutomedService.ListClasses = {
  methodName: "ListClasses",
  service: AutomedService,
  requestStream: false,
  responseStream: false,
  requestType: automed_pb.ListClassesRequest,
  responseType: automed_pb.ListClassesResponse
};

exports.AutomedService = AutomedService;

function AutomedServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

AutomedServiceClient.prototype.healthCheck = function healthCheck(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AutomedService.HealthCheck, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AutomedServiceClient.prototype.predict = function predict(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AutomedService.Predict, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AutomedServiceClient.prototype.predictBatch = function predictBatch(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AutomedService.PredictBatch, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AutomedServiceClient.prototype.listClasses = function listClasses(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AutomedService.ListClasses, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

exports.AutomedServiceClient = AutomedServiceClient;

