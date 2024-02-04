import Array "mo:base/Array";
import Blob "mo:base/Blob";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
// import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Debug "mo:base/Debug";
// import Result "mo:base/Result";

actor FileStorage {

  type FileData = {
    file : Blob;
    metadata : {
      uploader : Principal;
      uploadDate : Text;
    }
  };

  var fileId : Int = 0;
  var filesMap = HashMap.HashMap<Int, FileData>(10, Int.equal, Int.hash);
  var usersFile = HashMap.HashMap<Principal, [Int]>(10, Principal.equal, Principal.hash);

  public func getId() : async Int {
    fileId := fileId +1;
    return fileId
  };

  public func uploadFile(user : Principal, filedata : FileData) : async Text {
    try {
      Debug.print(debug_show (user,filedata));
      var currFileId : Int = await getId();
      filesMap.put(currFileId, filedata);

      var userArray : [Int] = switch (usersFile.get(user)) {
        case (?value) { value };
        case (null) { [] }
      };

      let updatedArray = Array.append<Int>(userArray, [currFileId]);

      usersFile.put(user, updatedArray);
      return "Successfully Uploaded"
    } catch (err) {
      return "Error Uploading File"
    };

  };

}
