import { useDispatch } from "react-redux";
import {
  renameFile,
  deleteFile,
  setSelectedFile // ✅ corrected import
} from "../store/slices/SidebarDataSlice";
import { useState } from "react";
import { MdInsertDriveFile, MdOutlineModeEditOutline, MdOutlineDeleteOutline } from "react-icons/md";
import styles from "../styles/FileItem.module.css";
import PopupModal from "./PopUpModal";

export default function FileItem({ file, folderId, existingItems, closeSidebar }) {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [fileName, setFileName] = useState(file.name);
  const [error, setError] = useState("");

  const handleEditClick = () => {
    setModalType("edit");
    setFileName(file.name);
    setError("");
    setShowModal(true);
  };

  const handleDeleteClick = () => {
    setModalType("delete");
    setShowModal(true);
  };

  const handleFileClick = () => {
    dispatch(setSelectedFile({ ...file })); // ✅ now works
    closeSidebar?.(); // ✅ closes sidebar in mobile
  };

  const handleConfirm = () => {
    const trimmed = fileName.trim();
    if (modalType === "edit") {
      if (!trimmed) {
        setError("Name cannot be empty");
        return;
      }
      const nameExists = existingItems
        .filter(f => f.id !== file.id)
        .some(f => f.name.toLowerCase() === trimmed.toLowerCase());
      if (nameExists) {
        setError("File name already exists");
        return;
      }
      dispatch(renameFile({ folderId, fileId: file.id, newName: trimmed }));
    } else {
      dispatch(deleteFile({ folderId, fileId: file.id }));
    }
    setShowModal(false);
  };

  const handleCancel = () => setShowModal(false);

  return (
    <>
      <div className={styles.fileContainer} onClick={handleFileClick}>
        <div className={styles.fileContent}>
          <MdInsertDriveFile className={styles.fileIcon} />
          <span className={styles.fileName} title={file.name}>{file.name}</span>
        </div>
        <div className={styles.actionIcons} onClick={(e) => e.stopPropagation()}>
          <MdOutlineModeEditOutline className={styles.icon} onClick={handleEditClick} />
          <MdOutlineDeleteOutline className={styles.icon} onClick={handleDeleteClick} />
        </div>
      </div>

      {showModal && (
        <PopupModal
          title={modalType === "edit" ? "Rename File" : "Delete File"}
          message={modalType === "edit" ? "" : `Are you sure you want to delete "${file.name}"?`}
          inputValue={modalType === "edit" ? fileName : null}
          onInputChange={setFileName}
          showInput={modalType === "edit"}
          error={error}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </>
  );
}
