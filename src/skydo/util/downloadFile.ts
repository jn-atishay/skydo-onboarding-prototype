import { saveAs } from "file-saver";
import { ALLOWED_METHODS } from "../constants/apiConstants";

interface Props {
  url: string;
  fileName?: string;
  onDownloadError?: (error?: any) => void;
  onDownloadComplete?: (fileName: string) => void;
  method?: string;
  body?: any;
}

const downloadFile = (props: Props) => {
  const { url, onDownloadError, onDownloadComplete, method = ALLOWED_METHODS.GET, body } = props;
  fetch(url)
    .then(async (res) => {
      if (res.status === 500) {
        onDownloadError && onDownloadError();
        return;
      }
      // These routes answer with the file itself, so a JSON body is always a non-file outcome and
      // carries the reason in `data`.
      if ((res.headers.get("content-type") || "").includes("application/json")) {
        throw await res.json();
      }
      const fileName = props.fileName ? props.fileName : res?.headers?.get("content-disposition")?.split("=")[1] || "";
      const resAsBlob = await res.blob();
      saveAs(resAsBlob, fileName);
      onDownloadComplete && onDownloadComplete(fileName);
    })
    .catch((e) => {
      onDownloadError && onDownloadError(e);
    });
};

export default downloadFile;
