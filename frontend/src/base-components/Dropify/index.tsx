import React, { useRef, useState, ChangeEvent } from "react";
import PropTypes from "prop-types";

import "./style.css";

import ImageConfig from "./imageConfig";
import uploadImg from "../../assets/images/cloud-upload-regular-240.png";

interface DropFileInputProps {
  onFileChange: (file: File | null) => void;
}

const Dropify: React.FC<DropFileInputProps> = ({ onFileChange }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [file, setFile] = useState<File | null>(null);

  const onDragEnter = () => {
    if (wrapperRef.current) {
      wrapperRef.current.classList.add("dragover");
    }
  };

  const onDragLeave = () => {
    if (wrapperRef.current) {
      wrapperRef.current.classList.remove("dragover");
    }
  };

  const onDrop = () => {
    if (wrapperRef.current) {
      wrapperRef.current.classList.remove("dragover");
    }
  };

  const onFileDrop = (e: ChangeEvent<HTMLInputElement>) => {
    const newFile = e.target.files?.[0];
    if (newFile) {
      setFile(newFile);
      onFileChange(newFile);
    }
  };

  const fileRemove = () => {
    setFile(null);
    onFileChange(null);
  };

  return (
    <>
      <div
        ref={wrapperRef}
        className="drop-file-input"
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div className="drop-file-input__label">
          <img src={uploadImg} alt="" />
          <p>Drag & Drop your file here</p>
        </div>
        <input type="file" value="" onChange={onFileDrop} />
      </div>
      {file ? (
        <div className="drop-file-preview">
          <p className="drop-file-preview__title">Ready to upload</p>
          <div className="drop-file-preview__item">
            <img
              src={
                ImageConfig[file.type.split("/")[1]] || ImageConfig["default"]
              }
              alt=""
            />
            <div className="drop-file-preview__item__info">
              <p>{file.name}</p>
              <p>{file.size}B</p>
            </div>
            <span className="drop-file-preview__item__del" onClick={fileRemove}>
              x
            </span>
          </div>
        </div>
      ) : null}
    </>
  );
};

Dropify.propTypes = {
  onFileChange: PropTypes.func.isRequired,
};

export default Dropify;
