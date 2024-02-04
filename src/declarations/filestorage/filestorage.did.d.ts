import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface FileData {
  'metadata' : { 'uploader' : Principal, 'uploadDate' : string },
  'file' : Uint8Array | number[],
}
export interface _SERVICE {
  'getId' : ActorMethod<[], bigint>,
  'uploadFile' : ActorMethod<[Principal, FileData], string>,
}
