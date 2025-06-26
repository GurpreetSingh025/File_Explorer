import { useEffect } from "react";
import { fetchSidebar } from "../store/slices/SidebarDataSlice";
import Directory from "./Directory";
import { useDispatch, useSelector } from "react-redux";
import styles from '../styles/Sidebar.module.css'

export default function Sidebar({ closeSidebar }) {
  const dispatch = useDispatch();
  const sidebarState = useSelector(state => state.sidebar);
  const sidebarData = sidebarState.data;

  useEffect(() => {
    dispatch(fetchSidebar());
  }, [dispatch]);

  return (
    <div className={styles.siderbarContainer}>
      {sidebarData.map((obj) => (
        <Directory key={obj.id} data={obj} closeSidebar={closeSidebar} />
      ))}
    </div>
  );
}
