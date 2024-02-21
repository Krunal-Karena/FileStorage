import Array "mo:base/Array";
import Blob "mo:base/Blob";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Debug "mo:base/Debug";
import StableMemory "mo:base/ExperimentalStableMemory";
import Nat64 "mo:base/Nat64";
import Iter "mo:base/Iter";

actor FileStorage {
   
   public func init() {
      // This will be executed once when the canister is deployed
      ignore StableMemory.grow(10);
   };

   private stable var fileOffset : Nat64 = 0;

   // user mappping to (file start offset,file size,file's metaDataSize) in stable memory
   private var usersFile = HashMap.HashMap<Principal, [(Nat64, Nat, Nat)]>(10, Principal.equal, Principal.hash);

   // stale structure which is used for pre & post upgrade to store Hashap
   private stable var usersFileStable : [(Principal, [(Nat64, Nat, Nat)])] = [];

   public shared (msg) func uploadFile(fileObject : Blob, metaDataSize : Nat) : async Text {
      try {
         let user = msg.caller;
         let size = fileObject.size();

         //Check if stable memory has enough space and if not then grow
         if(fileOffset + Nat64.fromNat(size + 100) >= (StableMemory.size()*64*1024)) {
            ignore StableMemory.grow(1);
         };

         //Store in stable memory
         StableMemory.storeBlob(fileOffset, fileObject);

         var userArray : [(Nat64, Nat, Nat)] = switch (usersFile.get(user)) {
            case (?value) { value };
            case (null) { [] }
         };

         //Update user Array
         let updatedArray = Array.append<(Nat64, Nat, Nat)>(userArray, [(fileOffset, size, metaDataSize)]);
         usersFile.put(user, updatedArray);

         //update fileOffset
         fileOffset := fileOffset + Nat64.fromNat(size + 100);

         return "Successfully Uploaded"
      } catch (err) {

         return "Error Uploading File"
      };

   };

   // get file ids corresponding to user
   public shared query (msg) func getUserFiles() : async [(Nat64, Nat, Nat)] {
      switch (usersFile.get(msg.caller)) {
         case (?fileIds) { return fileIds };
         case (null) { return [] }
      }
   };

   // get file data from file id
   public query func getFileData(fileId : (Nat64, Nat, Nat)) : async Blob {
      let (fileOffset, size, metaDataSize) = fileId;

      try {
         // Load data from stable memory
         var loadedBlob = StableMemory.loadBlob(fileOffset, size);
         return loadedBlob
      } catch (err) {
         return Blob.fromArray([])
      }
   };

   public shared (msg) func deleteFile(fileId : (Nat64, Nat, Nat)) : async Text {
      try {
         let user = msg.caller;

         // get user file list
         let userArray : [(Nat64, Nat, Nat)] = switch (usersFile.get(user)) {
            case (?value) { value };
            case (null) { return "User not found" }
         };

         //Update user list
         let updatedArray = Array.filter<(Nat64, Nat, Nat)>(userArray, func(id) { id != fileId });
         usersFile.put(user, updatedArray);

         return "Successfully Deleted"
      } catch (err) {
         return "Error Deleting File"
      }
   };

   public func shareFile(fileId : (Nat64, Nat, Nat), recipientId : Principal) : async Text {
      try {
         // get recipient's file list
         let recipientArray : [(Nat64, Nat, Nat)] = switch (usersFile.get(recipientId)) {
            case (?value) { value };
            case (null) { [] }
         };

         //Check if file already exist or not
         if (Array.find<(Nat64, Nat, Nat)>(recipientArray, func(id) { id == fileId }) != null) {
            return "File already shared"
         };

         //update recipient Array
         let updatedRecipientArray = Array.append<(Nat64, Nat, Nat)>(recipientArray, [fileId]);
         usersFile.put(recipientId, updatedRecipientArray);

         return "File shared successfully"
      } catch (err) {
         return "Error sharing file"
      }
   };

   system func preupgrade() {
      // Convert HashMap to an array of tuples
      usersFileStable := Iter.toArray(usersFile.entries())
   };

   system func postupgrade() {
      // Reconstruct the HashMap from the serialized entries
      usersFile := HashMap.fromIter<Principal, [(Nat64, Nat, Nat)]>(
         usersFileStable.vals(),
         usersFileStable.size(),
         Principal.equal,
         Principal.hash,
      )
   }
}
