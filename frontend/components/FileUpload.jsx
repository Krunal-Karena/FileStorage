import React, { useState } from 'react';
import { filestorage } from "../../src/declarations/filestorage";
import { Principal } from '@dfinity/principal';
import '../assets/fileUpload.css';

const FileUpload = (props) => {
   const [loading, setLoading] = useState(false);
   const [fileName, setFileName] = useState("");
   const [fileData, setFileData] = useState(null);
   const [metaDataSize, setMetaDataSize] = useState(0);

   const handleFileChange = (e) => {
      const file = e.target.files[0];
      handleFile(file);
   };

   const handleFile = async (file) => {
      if (file) {
         const maxSizeInBytes = 2 * 1024 * 1024; // 2 MB

         //Check for size limit
         if (file.size > maxSizeInBytes) {
            alert('File size exceeds the limit of 2 MB.');
            return;
         }
         setFileName(file.name);

         try {
            //Convert uploaded file + metaData into vecNat8(Blob) Format
            const reader = new FileReader();
            reader.onloadend = () => {
               const arrayBuffer = reader.result;
               const uint8Array = new Uint8Array(arrayBuffer);
               const vecNat8 = Array.from(uint8Array);

               //set metaData
               const metaDataJSON = JSON.stringify({
                  name: file.name,
                  size: file.size,
                  fileType: file.type,
                  uploader: Principal.fromText(props.user),
                  uploadDate: new Date().toISOString(),
               });

               const metaDataVecNat8 = Array.from(new TextEncoder().encode(metaDataJSON));
               setMetaDataSize(metaDataVecNat8.length);
               const combinedData = [...vecNat8, ...metaDataVecNat8];

               setFileData(combinedData);
            };
            reader.readAsArrayBuffer(file);
         } catch (error) {
            console.error('Error reading file:', error);
         }
      }
   };

   const handleUpload = async () => {
      if (fileData) {
         try {
            setLoading(true);
            let result = await filestorage.uploadFile(fileData, metaDataSize);
            alert(result);
            setLoading(false);
            window.location.reload();
         } catch (error) {
            console.error('Error uploading file:', error);
         }
      } else {
         alert('Please choose a file to upload');
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
            {fileName && `Selected File: ${fileName}`}
         </p>
         <button
            onClick={handleUpload}
            className="upload-btn"
         >
            {loading ? "Loading..." : "Upload"}
         </button>
      </div>
   );
};

export default FileUpload;
