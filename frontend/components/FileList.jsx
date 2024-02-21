import React, { useEffect, useState } from 'react';
import { filestorage } from "../../src/declarations/filestorage";
import { Principal } from '@dfinity/principal';
import '../assets/fileList.css';

const FileList = (props) => {
   const [files, setFiles] = useState([]);
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      fetchFiles();
   }, []);

   const fetchFiles = async () => {
      try {
         setLoading(true);
         //get ids(StartOffset,size,metaDataSize) of all the files
         const fileIds = await filestorage.getUserFiles();

         // Fetch the details of each file using file Ids
         const fileDetails = await Promise.all(
            fileIds.map(async (fileId) => {
               const fileData = await filestorage.getFileData(fileId);

               // Calculate the start index of the metadata
               const metadataStartIndex = fileData.length - Number(fileId[2]);

               //separate metaData and file 
               const metadataArray = fileData.slice(metadataStartIndex);
               const fileDataArray = fileData.slice(0, metadataStartIndex);

               const metadataString = new TextDecoder().decode(new Uint8Array(metadataArray));
               const metadata = JSON.parse(metadataString);

               const file = new Blob([new Uint8Array(fileDataArray)], { type: metadata.fileType });
               return {
                  fileId,
                  file,
                  metadata
               };
            })
         );

         setFiles(fileDetails);
         setLoading(false);
      } catch (error) {
         console.error('Error fetching files:', error);
      }
   };

   const handleDelete = async (fileId) => {
      try {
         setLoading(true);
         const result = await filestorage.deleteFile(fileId);
         alert(result);
         setLoading(false);
         fetchFiles();
      } catch (error) {
         console.error('Error deleting file:', error);
      }
   };

   const downloadFile = async (fileIndex) => {
      try {
         setLoading(true);
         const fileData = files[fileIndex].file;

         // Create a download link
         const downloadLink = document.createElement('a');
         downloadLink.href = URL.createObjectURL(fileData);
         downloadLink.download = files[fileIndex].metadata.name;

         // Append the link to the document and trigger the download
         document.body.appendChild(downloadLink);
         downloadLink.click();

         // Clean up
         document.body.removeChild(downloadLink);
         setLoading(false);
      } catch (error) {
         console.error('Error downloading file:', error);
      }
   };

   const shareFile = async (fileId) => {
      try {
         const recipientId = prompt('Enter the Principal ID of the recipient:');
         if (!recipientId) return;
         const result = await filestorage.shareFile(fileId, Principal.fromText(recipientId));
         alert(result);
      } catch (error) {
         console.error('Error sharing file:', error);
      }
   };
   return (
      <div>
         <h1>My Files</h1>
         <h2>{loading && `Loading...`}</h2>
         <table>
            <thead>
               <tr>
                  <th>Index</th>
                  <th>File Name</th>
                  <th>File Type</th>
                  <th>File Size</th>
                  <th>Upload Date</th>
                  <th>Action</th>
                  <th>Action</th>
                  <th>Action</th>
               </tr>
            </thead>
            <tbody>
               {files.map((file, index) => (
                  <tr key={index + 1}>
                     <td>{index + 1}</td>
                     <td>{file.metadata.name}</td>
                     <td>{file.metadata.fileType}</td>
                     <td>{(Number(file.metadata.size) / 1000).toFixed(1)}KB</td>
                     <td>{(new Date(file.metadata.uploadDate)).toDateString()}</td>
                     <td>
                        <button onClick={() => shareFile(file.fileId)}>Share</button>
                     </td>
                     <td>
                        <button onClick={() => downloadFile(index)}>Download</button>
                     </td>
                     <td>
                        <button onClick={() => handleDelete(file.fileId)}
                           disabled={props.user != file.metadata.uploader.__principal__}
                        >
                           Delete
                        </button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
};

export default FileList;
