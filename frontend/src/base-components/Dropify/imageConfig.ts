import fileDefault from "../../assets/images/file-png-solid-240.png";
import fileCSS from "../../assets/images/file-css-solid-240.png";
import filePdf from "../../assets/images/file-pdf-solid-240.png";
import filePng from "../../assets/images/file-png-solid-240.png";

interface ImageConfig {
  [key: string]: string;
}

const ImageConfig: ImageConfig = {
  default: fileDefault,
  pdf: filePdf,
  png: filePng,
  css: fileCSS,
};

export default ImageConfig;
