import { useEffect, useState } from "react";
import liff from "@line/liff";
import "./output.css"
import {APIProvider} from '@vis.gl/react-google-maps';

function App() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  
  
  useEffect(() => {
    liff
      .init({
        liffId: import.meta.env.VITE_LIFF_ID
      })  
      .then(() => {
        setMessage("LIFF init succeeded.");
      })
      .catch((e: Error) => {
        setMessage("LIFF init failed.");
        setError(`${e}`);
      });
  });

  return (
    
    <div className="App">
      <h1>create-liff-app</h1>
      {message && <p>{message}</p>}
      {error && (
        <p>
          <code>{error}</code>
        </p>
      )}
      <a
        href="https://developers.line.biz/ja/docs/liff/"
        target="_blank"
        rel="noreferrer"
      >
        LIFF Documentation
      </a>
      <h2>Test Test</h2>
    </div>
  );
}

export default App;
