import React, {useCallback, useContext, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import styles from "./Dropzone.module.css"
import {Context} from "../common/Context";

export function Dropzone() {
  const [resume, setResume] = useContext(Context)
  const [fileName, setFileName] = useState("");
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = (e) => {
        setResume(e.target.result);
        setFileName(file.name);
      }
      reader.readAsDataURL(file)
    });
  }, [])
  const {getRootProps, getInputProps} = useDropzone({onDrop, multiple: false })

  return (
    <div className={styles.main} {...getRootProps()}>
      <input {...getInputProps()} />
      <button type="button">
        <span><svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M14.0036 1.99646L17.0036 4.99646L16.999 4.99946L17 5.00001V13H16V5.99946L13 6.00001V2.99946H4V17.9995L12.0275 18.0003C12.0093 17.8361 12 17.6691 12 17.5C12 15.0147 14.0147 13 16.5 13C18.9853 13 21 15.0147 21 17.5C21 19.9853 18.9853 22 16.5 22C14.5409 22 12.8742 20.7481 12.2563 19.0007L3 19V2.00001H14L14.0036 1.99646ZM16.5 14C14.567 14 13 15.567 13 17.5C13 19.433 14.567 21 16.5 21C18.433 21 20 19.433 20 17.5C20 15.567 18.433 14 16.5 14ZM17 15V16.9995L19 17V18L17 17.9995V20H16V17.9995L14 18V17L16 16.9995V15H17ZM11 14V15H6V14H11ZM14 11V12H6V11H14ZM14 8.00001V9.00001H6V8.00001H14ZM14 3.40746V4.99946H15.592L14 3.40746Z"></path></svg></span>
        <span>CHOOSE RESUME</span>
      </button>
      <div>or drop Resume here (.pdf, .txt. .doc, .docx)</div>
      <p>{fileName}</p>
    </div>
  )
}
