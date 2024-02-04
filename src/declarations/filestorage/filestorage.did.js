export const idlFactory = ({ IDL }) => {
  const FileData = IDL.Record({
    'metadata' : IDL.Record({
      'uploader' : IDL.Principal,
      'uploadDate' : IDL.Text,
    }),
    'file' : IDL.Vec(IDL.Nat8),
  });
  return IDL.Service({
    'getId' : IDL.Func([], [IDL.Int], []),
    'uploadFile' : IDL.Func([IDL.Principal, FileData], [IDL.Text], []),
  });
};
export const init = ({ IDL }) => { return []; };
