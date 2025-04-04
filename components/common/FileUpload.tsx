// FileUpload.js (or your component where you're uploading files)
import React, { useState } from 'react';
import { storage, firestore, ref, uploadBytes, getDownloadURL, collection, addDoc, serverTimestamp } from '../../utils/firebase';  // Adjust the path based on your file structure

const FileUpload = () => {
  const [file, setFile] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<any>(null);
console.log(file,"file");

  const handleFileChange = (event:any) => {
    setFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      // Create a reference to the file in Firebase Storage
      const fileRef = ref(storage, `${file.name}`);

      // Upload the file to Firebase Storage
      await uploadBytes(fileRef, file);

      // Get the download URL of the file
      const downloadURL = await getDownloadURL(fileRef);
console.log(downloadURL,"downloadURL");

      // Store the URL and other info in Firestore
      await addDoc(collection(firestore, 'files'), {
        fileUrl: downloadURL,
        fileName: file.name,
        createdAt: serverTimestamp(),  // Correct usage of serverTimestamp
      });

      // Reset the state after successful upload
      setFile(null);
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadError("Error uploading file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <h2>Upload File</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload} disabled={isUploading}>
        {isUploading ? 'Uploading...' : 'Upload'}
      </button>

      {uploadError && <p style={{ color: 'red' }}>{uploadError}</p>}
    </div>
  );
};

export default FileUpload;
