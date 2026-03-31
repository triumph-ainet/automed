// package: automed
// file: automed.proto

import * as automed_pb from "./automed_pb";
import {grpc} from "@improbable-eng/grpc-web";

type AutomedServiceHealthCheck = {
  readonly methodName: string;
  readonly service: typeof AutomedService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof automed_pb.HealthCheckRequest;
  readonly responseType: typeof automed_pb.HealthCheckResponse;
};

type AutomedServicePredict = {
  readonly methodName: string;
  readonly service: typeof AutomedService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof automed_pb.PredictRequest;
  readonly responseType: typeof automed_pb.PredictResponse;
};

type AutomedServicePredictBatch = {
  readonly methodName: string;
  readonly service: typeof AutomedService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof automed_pb.PredictBatchRequest;
  readonly responseType: typeof automed_pb.PredictBatchResponse;
};

type AutomedServiceListClasses = {
  readonly methodName: string;
  readonly service: typeof AutomedService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof automed_pb.ListClassesRequest;
  readonly responseType: typeof automed_pb.ListClassesResponse;
};

export class AutomedService {
  static readonly serviceName: string;
  static readonly HealthCheck: AutomedServiceHealthCheck;
  static readonly Predict: AutomedServicePredict;
  static readonly PredictBatch: AutomedServicePredictBatch;
  static readonly ListClasses: AutomedServiceListClasses;
}

export type ServiceError = { message: string, code: number; metadata: grpc.Metadata }
export type Status = { details: string, code: number; metadata: grpc.Metadata }

interface UnaryResponse {
  cancel(): void;
}
interface ResponseStream<T> {
  cancel(): void;
  on(type: 'data', handler: (message: T) => void): ResponseStream<T>;
  on(type: 'end', handler: (status?: Status) => void): ResponseStream<T>;
  on(type: 'status', handler: (status: Status) => void): ResponseStream<T>;
}
interface RequestStream<T> {
  write(message: T): RequestStream<T>;
  end(): void;
  cancel(): void;
  on(type: 'end', handler: (status?: Status) => void): RequestStream<T>;
  on(type: 'status', handler: (status: Status) => void): RequestStream<T>;
}
interface BidirectionalStream<ReqT, ResT> {
  write(message: ReqT): BidirectionalStream<ReqT, ResT>;
  end(): void;
  cancel(): void;
  on(type: 'data', handler: (message: ResT) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'end', handler: (status?: Status) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'status', handler: (status: Status) => void): BidirectionalStream<ReqT, ResT>;
}

export class AutomedServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  healthCheck(
    requestMessage: automed_pb.HealthCheckRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: automed_pb.HealthCheckResponse|null) => void
  ): UnaryResponse;
  healthCheck(
    requestMessage: automed_pb.HealthCheckRequest,
    callback: (error: ServiceError|null, responseMessage: automed_pb.HealthCheckResponse|null) => void
  ): UnaryResponse;
  predict(
    requestMessage: automed_pb.PredictRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: automed_pb.PredictResponse|null) => void
  ): UnaryResponse;
  predict(
    requestMessage: automed_pb.PredictRequest,
    callback: (error: ServiceError|null, responseMessage: automed_pb.PredictResponse|null) => void
  ): UnaryResponse;
  predictBatch(
    requestMessage: automed_pb.PredictBatchRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: automed_pb.PredictBatchResponse|null) => void
  ): UnaryResponse;
  predictBatch(
    requestMessage: automed_pb.PredictBatchRequest,
    callback: (error: ServiceError|null, responseMessage: automed_pb.PredictBatchResponse|null) => void
  ): UnaryResponse;
  listClasses(
    requestMessage: automed_pb.ListClassesRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: automed_pb.ListClassesResponse|null) => void
  ): UnaryResponse;
  listClasses(
    requestMessage: automed_pb.ListClassesRequest,
    callback: (error: ServiceError|null, responseMessage: automed_pb.ListClassesResponse|null) => void
  ): UnaryResponse;
}

