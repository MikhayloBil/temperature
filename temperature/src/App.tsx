import React, { useState } from "react";

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("temperatureFile", selectedFile);

    try {
      const response = await fetch("/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setImageUrl(imageUrl);
      } else {
        console.error("Failed to upload file");
      }
    } catch (error) {
      console.error("Error uploading file", error);
    }
  };

  return (
    <div>
      <h1>Sea Surface Temperature Visualization</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload</button>
      {imageUrl && <img src={imageUrl} alt="Sea Surface Temperature Map" />}
    </div>
  );
};

export default App;
