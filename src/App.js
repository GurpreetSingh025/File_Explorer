import { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Content from './components/Content';
import { MdMenu } from 'react-icons/md';
import styles from './styles/AppLayout.module.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className={styles.appLayout}>
      <div className={styles.topbar}>
        <MdMenu className={styles.menuIcon} onClick={toggleSidebar} />
        <span className={styles.appTitle}>File Viewer</span>
      </div>

      <div className={styles.main}>
        <div className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
          <Sidebar closeSidebar={closeSidebar} />
        </div>

        <div className={styles.content}>
          <Content />
        </div>
      </div>
    </div>
  );
}

export default App;
