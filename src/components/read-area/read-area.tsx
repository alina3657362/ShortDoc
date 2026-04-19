import React from "react";
import styles from "./read-area.module.css"

interface ReadAreaProps {
  text: string;
}

export function ReadArea({text} : ReadAreaProps) : React.JSX.Element {
  return (
    <div>
      <div className={styles.container}>{text}</div>
    </div>
  )
}
