// FileUpload.jsx
import React, { useState } from 'react';
import { filestorage } from "../../src/declarations/filestorage";
import { Principal } from '@dfinity/principal';

const FileUpload = (props) => {
  const [fileData, setFileData] = useState({
    file: File,
    metadata: {
      name: String,
      size: Number,
      fileType: String,
      uploader: Principal, // Replace with actual user information
      uploadDate: String,
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    // Create a FileReader to read the file
    const reader = new FileReader();

    // Define a callback for when the reading is complete
    reader.onloadend = () => {
      // Convert the array buffer to Uint8Array
      const arrayBuffer = reader.result;
      const uint8Array = new Uint8Array(arrayBuffer);

      // Convert Uint8Array to vec nat8
      const vecNat8 = Array.from(uint8Array);

      // Update fileData with file information
      setFileData(() => ({
        file: vecNat8,
        metadata: {
          name: file.name,
          size: file.size,
          fileType: file.type,
          uploader: Principal.fromText(props.user),
          uploadDate: new Date().toISOString(),
        },
      }));
    };
  
    // Read the file as an array buffer
    reader.readAsArrayBuffer(file);
  };

  const handleUpload = async () => {
    // console.log(fileData);
    if (fileData.file) {
      try {
        // Pass the entire fileData object to the onFileUpload function
        let result = await filestorage.uploadFile(Principal.fromText(props.user), fileData);
        alert(result);
        window.location.reload();
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default FileUpload;
