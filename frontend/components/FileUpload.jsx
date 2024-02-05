import React, { useState } from 'react';
import { filestorage } from "../../src/declarations/filestorage";
import { Principal } from '@dfinity/principal';
import '../assets/fileUpload.css';

const FileUpload = (props) => {
  const [Loading, setLoading] = useState(false);
  const [fileData, setFileData] = useState({
    file: null,
    metadata: {
      name: "",
      size: 0,
      fileType: "",
      uploader: Principal,
      uploadDate: "",
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleFile = (file) => {
    if (file) {
      // Check if file size is within the limit (2 MB)
      const maxSizeInBytes = 2 * 1024 * 1024; // 2 MB
      if (file.size > maxSizeInBytes) {
        alert('File size exceeds the limit of 2 MB.');
        return;
      }
      // convert file into vec nat8 format 
      const reader = new FileReader();
      reader.onloadend = () => {
        const arrayBuffer = reader.result;
        const uint8Array = new Uint8Array(arrayBuffer);
        const vecNat8 = Array.from(uint8Array);

        setFileData({
          file: vecNat8,
          metadata: {
            name: file.name,
            size: file.size,
            fileType: file.type,
            uploader: Principal.fromText(props.user),
            uploadDate: new Date().toISOString(),
          },
        });
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleUpload = async () => {
    if (fileData.file) {
      try {
        setLoading(true);
        let result = await filestorage.uploadFile(Principal.fromText(props.user), fileData);
        alert(result);
        setLoading(false);
        window.location.reload();
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  return (
    <div className="file-upload-container">
      <input
        type="file"
        onChange={handleFileChange}
        className="file-input"
      />
      <button
        onClick={() => document.querySelector('.file-input').click()}
        className="choose-file-btn"
      >
        Choose File
      </button>
      <p className="selected-file-info">
        {fileData.metadata.name && `Selected File: ${fileData.metadata.name}`}
      </p>
      <button
        onClick={handleUpload}
        className="upload-btn"
      >
        {
          Loading ? "Loading..." : "Upload"
        }
      </button>
    </div>
  );
};

export default FileUpload;
