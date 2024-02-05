export const idlFactory = ({ IDL }) => {
  const FileData = IDL.Record({
    'metadata' : IDL.Record({
      'name' : IDL.Text,
      'size' : IDL.Int,
      'fileType' : IDL.Text,
      'uploader' : IDL.Principal,
      'uploadDate' : IDL.Text,
    }),
    'file' : IDL.Vec(IDL.Nat8),
  });
  return IDL.Service({
    'deleteFile' : IDL.Func([IDL.Int], [IDL.Text], []),
    'getFileData' : IDL.Func([IDL.Nat], [FileData], ['query']),
    'getId' : IDL.Func([], [IDL.Int], []),
    'getUserFiles' : IDL.Func([IDL.Principal], [IDL.Vec(IDL.Int)], ['query']),
    'shareFile' : IDL.Func([IDL.Int, IDL.Principal], [IDL.Text], []),
    'uploadFile' : IDL.Func([IDL.Principal, FileData], [IDL.Text], []),
  });
};
export const init = ({ IDL }) => { return []; };
