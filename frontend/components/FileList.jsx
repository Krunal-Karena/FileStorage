import React, { useEffect, useState } from 'react';
import { filestorage } from "../../src/declarations/filestorage";
import { Principal } from '@dfinity/principal';
import '../assets/fileList.css';

const FileList = (props) => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const userPrincipal = Principal.fromText(props.user);
      const fileIds = await filestorage.getUserFiles(userPrincipal);

      // Fetch the details of each file using file IDs
      const fileDetails = await Promise.all(
        fileIds.map(async (fileId) => {
          const fileData = await filestorage.getFileData(fileId);
          return {
            fileId,
            fileData
          };
        })
      );
      setFiles(fileDetails);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const handleDelete = async (fileId) => {
    try {
      const result = await filestorage.deleteFile(fileId);
      alert(result);
      fetchFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const downloadFile = async (fileIndex) => {
    try {
      const fileData = files[fileIndex].fileData;
      // Convert the file data to a Blob
      const blob = new Blob([new Uint8Array(fileData.file)], { type: fileData.metadata.fileType });

      // Create a download link
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = fileData.metadata.name;

      // Append the link to the document and trigger the download
      document.body.appendChild(downloadLink);
      downloadLink.click();

      // Clean up
      document.body.removeChild(downloadLink);
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
              <td>{file.fileData.metadata.name}</td>
              <td>{file.fileData.metadata.fileType}</td>
              <td>{(Number(file.fileData.metadata.size) / 1000).toFixed(1)}KB</td>
              <td>{(new Date(file.fileData.metadata.uploadDate)).toDateString()}</td>
              <td>
                <button onClick={() => shareFile(file.fileId)}>Share</button>
              </td>
              <td>
                <button onClick={() => downloadFile(index)}>Download</button>
              </td>
              <td>
                <button onClick={() => handleDelete(file.fileId)}
                  disabled={props.user !== file.fileData.metadata.uploader.toText()}
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
