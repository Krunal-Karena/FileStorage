// FileUpload.jsx
import React, { useState } from 'react';
import {filestorage} from "../../src/declarations/filestorage";
import { Principal } from '@dfinity/principal';

const FileUpload = (props) => {
  const [fileData, setFileData] = useState({
    file: File,
    metadata: {
      uploader: Principal, // Replace with actual user information
      uploadDate: String,
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    // Update fileData with file information
    setFileData(() => ({
      file:file,
      metadata: {
        uploader: Principal.fromText(props.user),
        uploadDate: new Date().toISOString()
      },
    }));
  };

  const handleUpload = async () => {
    console.log(fileData);
    if (fileData.file) {
      try {
        // Pass the entire fileData object to the onFileUpload function

        let result=await filestorage.uploadFile(Principal.fromText(props.user),fileData);
        console.log(result);
        
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
