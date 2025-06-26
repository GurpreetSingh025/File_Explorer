import styles from '../styles/PopupModal.module.css';

export default function PopupModal({
  title,
  message,
  inputValue,
  onInputChange,
  showInput = false,
  onConfirm,
  onCancel,
  error = ""
}) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {title && <h3>{title}</h3>}
        {message && <p>{message}</p>}

        {showInput && (
          <>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder="Enter name"
              className={styles.inputField}
              autoFocus
            />
            {error && <div className={styles.errorText}>{error}</div>}
          </>
        )}

        <div className={styles.modalActions}>
          <button onClick={onConfirm} className={styles.confirmBtn}>Yes</button>
          <button onClick={onCancel} className={styles.cancelBtn}>No</button>
        </div>
      </div>
    </div>
  );
}
