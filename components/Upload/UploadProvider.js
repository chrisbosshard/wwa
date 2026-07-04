import React from "react";
import styles from "../../styles/Crypto.module.css";
import { useCSVReader } from "react-papaparse";
import { createWish } from "@lib/directus/api-client";
import Button from "@mui/material/Button";

const UploadProvider = () => {
  const { CSVReader } = useCSVReader();

  const handleOnFileLoad = async (data) => {
    for (let i = 0; i < data.length; i++) {
      const row = data[i].data;
      if (row[0]) {
        await createWish({
          description: row[0],
          link: row[1] || "",
          active: true,
          year: "2026",
        });
      }
    }
    alert("Wishes uploaded");
  };

  return (
    <div className={styles.container}>
      <CSVReader onUploadAccepted={(results) => handleOnFileLoad(results.data)}>
        {({ getRootFileInputProps, getRootProps, ProgressBar }) => (
          <>
            <div {...getRootProps()}>
              <Button variant="contained">Upload CSV</Button>
              <input {...getRootFileInputProps()} />
            </div>
            <ProgressBar />
          </>
        )}
      </CSVReader>
    </div>
  );
};

export default UploadProvider;
