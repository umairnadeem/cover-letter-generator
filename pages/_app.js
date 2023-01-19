import { Roboto } from "@next/font/google";
import { Open_Sans } from "@next/font/google";
import "./styles.css";

const roboto = Roboto({ subsets: ["latin"], weight: "400" }); // sans-serif
const openSans = Open_Sans({ subsets: ["latin"] }); // serif

export default function App({ Component, pageProps }) {
  return (
    <>
      <style jsx global>{`
        h1 {
          font-family: ${roboto.style.fontFamily};
          font-weight: bold;
        }
        body,
        p,
        h2,
        h3,
        h4,
        h5 {
          font-family: ${openSans.style.fontFamily};
        }
      `}</style>
      <div className="head">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="50"
          viewBox="0 0 50 50"
        >
          <rect width="100%" height="100%" fill="#EDEDED" />
          <g>
            <rect x="40%" y="40%" width="300%" height="300%" fill="#FFFFFF" />
            <rect x="70%" y="70%" width="260%" height="260%" fill="#FFD400" />
          </g>
        </svg>
        <h1>
          JobReady<font color="#FFD400">.</font>ai
        </h1>
        <div>Cover Letter Generator</div>
      </div>
      <Component {...pageProps} />
    </>
  );
}
