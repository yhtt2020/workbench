// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var game$assist_pb = require('./game-assist_pb.js');

function serialize_gameAssist_Empty(arg) {
  if (!(arg instanceof game$assist_pb.Empty)) {
    throw new Error('Expected argument of type gameAssist.Empty');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_gameAssist_Empty(buffer_arg) {
  return game$assist_pb.Empty.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_gameAssist_FPSResponse(arg) {
  if (!(arg instanceof game$assist_pb.FPSResponse)) {
    throw new Error('Expected argument of type gameAssist.FPSResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_gameAssist_FPSResponse(buffer_arg) {
  return game$assist_pb.FPSResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_gameAssist_IconRequest(arg) {
  if (!(arg instanceof game$assist_pb.IconRequest)) {
    throw new Error('Expected argument of type gameAssist.IconRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_gameAssist_IconRequest(buffer_arg) {
  return game$assist_pb.IconRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_gameAssist_IconResponse(arg) {
  if (!(arg instanceof game$assist_pb.IconResponse)) {
    throw new Error('Expected argument of type gameAssist.IconResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_gameAssist_IconResponse(buffer_arg) {
  return game$assist_pb.IconResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var SystemToolService = exports.SystemToolService = {
  getIcon: {
    path: '/gameAssist.SystemTool/GetIcon',
    requestStream: false,
    responseStream: false,
    requestType: game$assist_pb.IconRequest,
    responseType: game$assist_pb.IconResponse,
    requestSerialize: serialize_gameAssist_IconRequest,
    requestDeserialize: deserialize_gameAssist_IconRequest,
    responseSerialize: serialize_gameAssist_IconResponse,
    responseDeserialize: deserialize_gameAssist_IconResponse,
  },
};

exports.SystemToolClient = grpc.makeGenericClientConstructor(SystemToolService);
var InspectorService = exports.InspectorService = {
  getFPS: {
    path: '/gameAssist.Inspector/GetFPS',
    requestStream: false,
    responseStream: false,
    requestType: game$assist_pb.Empty,
    responseType: game$assist_pb.FPSResponse,
    requestSerialize: serialize_gameAssist_Empty,
    requestDeserialize: deserialize_gameAssist_Empty,
    responseSerialize: serialize_gameAssist_FPSResponse,
    responseDeserialize: deserialize_gameAssist_FPSResponse,
  },
};

exports.InspectorClient = grpc.makeGenericClientConstructor(InspectorService);
