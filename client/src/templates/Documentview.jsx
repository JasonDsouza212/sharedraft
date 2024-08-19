import React, { useState, useEffect } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs`;

const Documentview = ({ contractlink }) => {
  const [numPages, setNumPages] = useState(null);
  const [width, setWidth] = useState(1200);

  useEffect(() => {
    setWidth(window.innerWidth);
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div>
      <Document
        file={{ url: contractlink }}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        {Array.from(new Array(numPages), (el, index) => (
          <div
            key={`div_${index + 1}`}
            style={{
              marginBottom: "10px",
              border: "2px solid black",
              padding: "10px",
              display: "inline-block",
            }}
          >
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              scale={1}
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
          </div>
        ))}
      </Document>
    </div>
  );
};

export default Documentview;
