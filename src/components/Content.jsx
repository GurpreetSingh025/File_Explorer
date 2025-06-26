import { useSelector } from 'react-redux';
import styles from '../styles/Content.module.css';

export default function Content() {
  const selectedFile = useSelector(state => state.sidebar.selectedFile);

  return (
    <div className={styles.contentContainer}>
      {selectedFile ? (
        <div className={styles.fileContent}>
          <h2 className={styles.fileName}>{selectedFile.name}</h2>
          <pre className={styles.fileText}>{selectedFile.content}</pre>
        </div>
      ) : (
        <div className={styles.placeholder}>Select a file to view its content.</div>
      )}
    </div>
  );
}
