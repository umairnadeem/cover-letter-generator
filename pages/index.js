import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import { Dropzone } from "../components/Dropzone";
import { Loader } from "../components/Loader";
import { Context } from "../common/Context";
import { sanitizeString } from "../common/utils";

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
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setResult(data.result);
      setLoading(false);
    } catch (error) {
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
      <div className={styles.container}>
        {loading ? <Loader /> : null}
        <main
          className={styles.main}
          style={
            loading
              ? { opacity: 0.2, pointerEvents: "none", userSelect: "none" }
              : null
          }
        >
          <div className={styles.gridItem}>
            <Dropzone />
            <form onSubmit={onSubmit}>
              <input
                type="text"
                name="prompt"
                placeholder="Role"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <input type="submit" value="Generate" />
            </form>
          </div>
          <div className={styles.gridItem}>
            <div className={styles.result}>
              {result ? (
                <div id={styles.copy}>
                  <svg
                    className={styles.copyButton}
                    onClick={() => {
                      navigator.clipboard.writeText(result);
                    }}
                    focusable="false"
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                  >
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"></path>
                  </svg>
                </div>
              ) : null}
              {result}
            </div>
          </div>
        </main>
      </div>
    </Context.Provider>
  );
}
