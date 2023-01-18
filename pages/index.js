import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import {Dropzone} from "../components/Dropzone";
import {Loader} from "../components/Loader";
import {Context} from "../common/Context";
import {sanitizeString} from "../common/utils";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState();
  const [resume, setResume] = useState();
  const [loading, setLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: sanitizeString(prompt), resume }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setLoading(false);
    } catch(error) {
      setLoading(false);
      console.error(error);
      alert(error.message);
    }
  }
  return (
    <Context.Provider value={[resume, setResume]}>
        <Head>
          <title>JobReady</title>
        </Head>
        <div className={styles.heading}>
        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
            <rect width="100%" height="100%" fill="#EDEDED"/>
            <g>
              <rect x="40%" y="40%" width="300%" height="300%" fill="#FFFFFF"/>
              <rect x="70%" y="70%" width="260%" height="260%" fill="#FFD400"/>
            </g>
          </svg>
          <h1>JobReady<font color="#FFD400">.</font>ai</h1>
          <div>Cover Letter Generator</div>
        </div>
          <main className={styles.main}>
          {
            loading
              ? <Loader/>
              : null
        }
        <div className={styles.main} style={loading ? { opacity: 0.2, pointerEvents: "none", userSelect: "none" } : null}>
        <Dropzone/>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              name="prompt"
              placeholder="Role"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <input type="submit" value="Submit" />
          </form>
          <div className={styles.result}>{result}</div>
        </div>
        </main>
    </Context.Provider>
  );
}
