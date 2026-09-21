import Locale from "../../../util/locale/en";
import { useEffect } from "react";

interface Props {
  setFileDragging: (value: boolean) => void;
  setError: (value: boolean) => void;
  setErrorMessage: (value: string) => void;
  onFileSelect?: (file: File) => void;
  isMultipleUploadSupported?: boolean;
  onMultipleFileSelect?: (files: FileList | never[]) => void;
}

const DragAndDropListener = (props: Props) => {
  const { setFileDragging, onFileSelect, setErrorMessage, setError, isMultipleUploadSupported, onMultipleFileSelect } =
    props;
  const onDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopImmediatePropagation();
    setFileDragging(false);
  };

  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFileDragging(true);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFileDragging(false);
    const files = e.dataTransfer?.files || [];
    if (isMultipleUploadSupported) {
      onMultipleFileSelect?.(files);
    } else {
      if (files.length > 1) {
        setError(true);
        setErrorMessage(Locale.multipleFileUploadError);
        return;
      }
      onFileSelect?.(files[0]);
    }
  };

  useEffect(() => {
    document.addEventListener("dragover", onDragOver, { capture: true });
    document.addEventListener("dragleave", onDragLeave, { capture: true });
    document.addEventListener("drop", onDrop, { capture: true });
    return () => {
      document.removeEventListener("dragleave", onDragLeave, { capture: true });
      document.removeEventListener("dragover", onDragOver, { capture: true });
      document.removeEventListener("drop", onDrop, { capture: true });
    };
  }, []);
  return null;
};

export default DragAndDropListener;
