import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface _SERVICE {
  'deleteFile' : ActorMethod<[[bigint, bigint, bigint]], string>,
  'getFileData' : ActorMethod<
    [[bigint, bigint, bigint]],
    Uint8Array | number[]
  >,
  'getUserFiles' : ActorMethod<[], Array<[bigint, bigint, bigint]>>,
  'init' : ActorMethod<[], undefined>,
  'shareFile' : ActorMethod<[[bigint, bigint, bigint], Principal], string>,
  'uploadFile' : ActorMethod<[Uint8Array | number[], bigint], string>,
}
