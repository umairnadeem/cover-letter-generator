import { Roboto } from "@next/font/google";
import { Open_Sans } from "@next/font/google";

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
      <Component {...pageProps} />
    </>
  );
}
