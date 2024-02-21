export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'deleteFile' : IDL.Func(
        [IDL.Tuple(IDL.Nat64, IDL.Nat, IDL.Nat)],
        [IDL.Text],
        [],
      ),
    'getFileData' : IDL.Func(
        [IDL.Tuple(IDL.Nat64, IDL.Nat, IDL.Nat)],
        [IDL.Vec(IDL.Nat8)],
        ['query'],
      ),
    'getUserFiles' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Nat64, IDL.Nat, IDL.Nat))],
        ['query'],
      ),
    'init' : IDL.Func([], [], ['oneway']),
    'shareFile' : IDL.Func(
        [IDL.Tuple(IDL.Nat64, IDL.Nat, IDL.Nat), IDL.Principal],
        [IDL.Text],
        [],
      ),
    'uploadFile' : IDL.Func([IDL.Vec(IDL.Nat8), IDL.Nat], [IDL.Text], []),
  });
};
export const init = ({ IDL }) => { return []; };
