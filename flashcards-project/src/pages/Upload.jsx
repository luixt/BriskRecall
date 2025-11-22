import React from "react";
import UploadForm from "../components/UploadForm";
import "./Upload.css";

const UploadPage = () => {
  return (
    <div className="upload-page">
      <h1>Upload a PDF to Generate Flashcards</h1>
      <UploadForm />
    </div>
  );
};

export default UploadPage;