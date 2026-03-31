// package: automed
// file: automed.proto

import * as jspb from "google-protobuf";

export class HealthCheckRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HealthCheckRequest.AsObject;
  static toObject(includeInstance: boolean, msg: HealthCheckRequest): HealthCheckRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: HealthCheckRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HealthCheckRequest;
  static deserializeBinaryFromReader(message: HealthCheckRequest, reader: jspb.BinaryReader): HealthCheckRequest;
}

export namespace HealthCheckRequest {
  export type AsObject = {
  }
}

export class HealthCheckResponse extends jspb.Message {
  getStatus(): string;
  setStatus(value: string): void;

  getMessage(): string;
  setMessage(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HealthCheckResponse.AsObject;
  static toObject(includeInstance: boolean, msg: HealthCheckResponse): HealthCheckResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: HealthCheckResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HealthCheckResponse;
  static deserializeBinaryFromReader(message: HealthCheckResponse, reader: jspb.BinaryReader): HealthCheckResponse;
}

export namespace HealthCheckResponse {
  export type AsObject = {
    status: string,
    message: string,
  }
}

export class PredictRequest extends jspb.Message {
  getImageBase64(): string;
  setImageBase64(value: string): void;

  getImageFormat(): string;
  setImageFormat(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PredictRequest.AsObject;
  static toObject(includeInstance: boolean, msg: PredictRequest): PredictRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PredictRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PredictRequest;
  static deserializeBinaryFromReader(message: PredictRequest, reader: jspb.BinaryReader): PredictRequest;
}

export namespace PredictRequest {
  export type AsObject = {
    imageBase64: string,
    imageFormat: string,
  }
}

export class PredictResponse extends jspb.Message {
  getClassName(): string;
  setClassName(value: string): void;

  getProbability(): number;
  setProbability(value: number): void;

  getIsAuthentic(): boolean;
  setIsAuthentic(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PredictResponse.AsObject;
  static toObject(includeInstance: boolean, msg: PredictResponse): PredictResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PredictResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PredictResponse;
  static deserializeBinaryFromReader(message: PredictResponse, reader: jspb.BinaryReader): PredictResponse;
}

export namespace PredictResponse {
  export type AsObject = {
    className: string,
    probability: number,
    isAuthentic: boolean,
  }
}

export class PredictBatchRequest extends jspb.Message {
  clearRequestsList(): void;
  getRequestsList(): Array<PredictRequest>;
  setRequestsList(value: Array<PredictRequest>): void;
  addRequests(value?: PredictRequest, index?: number): PredictRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PredictBatchRequest.AsObject;
  static toObject(includeInstance: boolean, msg: PredictBatchRequest): PredictBatchRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PredictBatchRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PredictBatchRequest;
  static deserializeBinaryFromReader(message: PredictBatchRequest, reader: jspb.BinaryReader): PredictBatchRequest;
}

export namespace PredictBatchRequest {
  export type AsObject = {
    requestsList: Array<PredictRequest.AsObject>,
  }
}

export class PredictBatchResponse extends jspb.Message {
  clearPredictionsList(): void;
  getPredictionsList(): Array<PredictResponse>;
  setPredictionsList(value: Array<PredictResponse>): void;
  addPredictions(value?: PredictResponse, index?: number): PredictResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PredictBatchResponse.AsObject;
  static toObject(includeInstance: boolean, msg: PredictBatchResponse): PredictBatchResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PredictBatchResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PredictBatchResponse;
  static deserializeBinaryFromReader(message: PredictBatchResponse, reader: jspb.BinaryReader): PredictBatchResponse;
}

export namespace PredictBatchResponse {
  export type AsObject = {
    predictionsList: Array<PredictResponse.AsObject>,
  }
}

export class ListClassesRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListClassesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListClassesRequest): ListClassesRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListClassesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListClassesRequest;
  static deserializeBinaryFromReader(message: ListClassesRequest, reader: jspb.BinaryReader): ListClassesRequest;
}

export namespace ListClassesRequest {
  export type AsObject = {
  }
}

export class ListClassesResponse extends jspb.Message {
  clearClassNamesList(): void;
  getClassNamesList(): Array<string>;
  setClassNamesList(value: Array<string>): void;
  addClassNames(value: string, index?: number): string;

  clearIsAuthenticList(): void;
  getIsAuthenticList(): Array<boolean>;
  setIsAuthenticList(value: Array<boolean>): void;
  addIsAuthentic(value: boolean, index?: number): boolean;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListClassesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ListClassesResponse): ListClassesResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListClassesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListClassesResponse;
  static deserializeBinaryFromReader(message: ListClassesResponse, reader: jspb.BinaryReader): ListClassesResponse;
}

export namespace ListClassesResponse {
  export type AsObject = {
    classNamesList: Array<string>,
    isAuthenticList: Array<boolean>,
  }
}

