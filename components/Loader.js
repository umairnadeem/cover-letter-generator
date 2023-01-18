import React from 'react'
import styles from "./Loader.module.css";

export function Loader() {
  return (
    <div className={styles.loader}>
      <div className={styles.ldsRoller}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    </div>
  )
}