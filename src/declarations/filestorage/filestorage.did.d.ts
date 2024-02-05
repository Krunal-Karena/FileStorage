import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface FileData {
  'metadata' : {
    'name' : string,
    'size' : bigint,
    'fileType' : string,
    'uploader' : Principal,
    'uploadDate' : string,
  },
  'file' : Uint8Array | number[],
}
export interface _SERVICE {
  'deleteFile' : ActorMethod<[bigint], string>,
  'getFileData' : ActorMethod<[bigint], FileData>,
  'getId' : ActorMethod<[], bigint>,
  'getUserFiles' : ActorMethod<[Principal], Array<bigint>>,
  'shareFile' : ActorMethod<[bigint, Principal], string>,
  'uploadFile' : ActorMethod<[Principal, FileData], string>,
}
