import {
  MdOutlineKeyboardArrowRight,
  MdKeyboardArrowDown,
  MdOutlineModeEditOutline,
  MdOutlineDeleteOutline,
  MdOutlineFolder,
  MdAdd,
  MdCreateNewFolder
} from "react-icons/md";
import { useDispatch } from "react-redux";
import {
  deleteFolder,
  addFile,
  addFolder,
  renameFolder
} from "../store/slices/SidebarDataSlice";
import styles from '../styles/Directory.module.css';
import FileItem from "./FileItem";
import PopupModal from "./PopUpModal";
import { useState } from "react";

export default function Directory({ data, closeSidebar }) {
  const dispatch = useDispatch();
  const [expandFlag, setExpandFlag] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  const handleExpandCollapse = () => setExpandFlag(!expandFlag);

  const openModal = (type) => {
    setModalType(type);
    setFileName("");
    setError("");
    setShowModal(true);
  };

  const handleConfirm = () => {
    const trimmed = fileName.trim();

    if (modalType.startsWith("create") || modalType === "edit") {
      if (!trimmed) {
        setError("Name cannot be empty");
        return;
      }
      const existingNames = data.items.map(i => i.name.toLowerCase());
      if (existingNames.includes(trimmed.toLowerCase())) {
        setError("Name already exists");
        return;
      }
    }

    if (modalType === "createFile") {
      dispatch(addFile({ folderId: data.id, name: trimmed }));
    } else if (modalType === "createFolder") {
      dispatch(addFolder({ name: trimmed, parentId: data.id }));
    } else if (modalType === "delete") {
      dispatch(deleteFolder({ folderId: data.id }));
    } else if (modalType === "edit") {
      dispatch(renameFolder({ folderId: data.id, newName: trimmed }));
    }

    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
    setError("");
  };

  return (
    <div>
      <div className={styles.directoryContainer}>
        <span className={styles.expandIcon} onClick={handleExpandCollapse}>
          {expandFlag ? <MdKeyboardArrowDown /> : <MdOutlineKeyboardArrowRight />}
        </span>

        <div className={styles.directoryContent}>
          <MdOutlineFolder className={styles.folderIcon} />
          <span className={styles.directoryName} title={data.name}>{data.name}</span>
        </div>

        <div className={styles.actionIcons}>
          <MdAdd className={styles.icon} title="Add File" onClick={() => openModal("createFile")} />
          <MdCreateNewFolder className={styles.icon} title="Add Folder" onClick={() => openModal("createFolder")} />
          <MdOutlineModeEditOutline className={styles.icon} title="Rename Folder" onClick={() => openModal("edit")} />
          <MdOutlineDeleteOutline className={styles.icon} title="Delete Folder" onClick={() => openModal("delete")} />
        </div>
      </div>

      {expandFlag && data.items?.length > 0 && (
        <div className={styles.childItems}>
          {data.items.map(obj =>
            obj.type === "folder" ? (
              <Directory key={obj.id} data={obj} closeSidebar={closeSidebar} />
            ) : (
              <FileItem
                key={obj.id}
                file={obj}
                folderId={data.id}
                existingItems={data.items}
                closeSidebar={closeSidebar}
              />
            )
          )}
        </div>
      )}

      {showModal && (
        <PopupModal
          title={
            modalType === "createFile"
              ? "Create New File"
              : modalType === "createFolder"
              ? "Create New Folder"
              : modalType === "edit"
              ? "Rename Folder"
              : "Delete Folder"
          }
          message={
            modalType.startsWith("create")
              ? ""
              : `Are you sure you want to ${modalType} the folder "${data.name}"?`
          }
          inputValue={modalType.startsWith("create") || modalType === "edit" ? fileName : null}
          onInputChange={setFileName}
          showInput={modalType.startsWith("create") || modalType === "edit"}
          error={error}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
