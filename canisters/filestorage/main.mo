import Array "mo:base/Array";
import Blob "mo:base/Blob";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Int "mo:base/Int";
import Debug "mo:base/Debug";

actor FileStorage {

  type FileData = {
    file : Blob;
    metadata : {
      name : Text;
      size : Int;
      fileType : Text;
      uploader : Principal;
      uploadDate : Text
    }
  };

  stable var fileId : Int = 0;
  // file id map to filedata
  var filesMap = HashMap.HashMap<Int, FileData>(10, Int.equal, Int.hash);
  // user map to file ids
  var usersFile = HashMap.HashMap<Principal, [Int]>(10, Principal.equal, Principal.hash);

  public func getId() : async Int {
    fileId := fileId +1;
    return fileId
  };

  public func uploadFile(user : Principal, filedata : FileData) : async Text {
    try {
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

  // get file ids corresponding to user
  public query func getUserFiles(user : Principal) : async [Int] {
    switch (usersFile.get(user)) {
      case (?fileIds) { return fileIds };
      case (null) { return [] }
    }
  };

  //get file data from file id
  public query func getFileData(fileId : Nat) : async FileData {
    switch (filesMap.get(fileId)) {
      case (?fileData) { return fileData };
      case (null) {
        return {
          file = Blob.fromArray([]);
          metadata = {
            name = "";
            size = 0;
            fileType = "";
            uploader = Principal.fromText("");
            uploadDate = ""
          }
        }
      }
    }
  };

  public func deleteFile(fileId : Int) : async Text {
    try {

      let fileData = switch (filesMap.get(fileId)) {
        case (?data) { data };
        case (null) { return "File not found" }
      };

      // Remove file ID from user's file list
      let user = fileData.metadata.uploader;
      let userArray : [Int] = switch (usersFile.get(user)) {
        case (?value) { value };
        case (null) { return "User not found" }
      };
      let updatedArray = Array.filter<Int>(userArray, func(id : Int) = id != fileId);
      usersFile.put(user, updatedArray);

      // Remove file data from filesMap
      filesMap.delete(fileId);

      return "Successfully Deleted"
    } catch (err) {
      return "Error Deleting File"
    }
  };

  public func shareFile(fileId : Int, recipientId : Principal) : async Text {
    try {
      // Update the usersFile map for the recipient
      let recipientArray : [Int] = switch (usersFile.get(recipientId)) {
        case (?value) { value };
        case (null) { [] }
      };

      let updatedRecipientArray = Array.append<Int>(recipientArray, [fileId]);
      usersFile.put(recipientId, updatedRecipientArray);

      return "File shared successfully"
    } catch (err) {
      return "Error sharing file"
    }
  }
}
