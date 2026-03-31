/**
 * AutoMed – AI UI Constructor (Sandbox v2)
 * Medication image analysis demo aligned with the published gRPC API.
 * Upload stubs generated from server/automed.proto (npm run generate-stubs in automed/).
 */

import React, { useState, useEffect, useCallback } from "react";
import StyledButton from "@integratedComponents/StyledButton";
import { AutomedService } from "./automed_pb_service";
import "./style.css";

const MAX_FILE_BYTES = 4 * 1024 * 1024; // align with typical daemon max_message_size_in_mb

function fileToBase64Payload(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No file selected."));
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      reject(new Error(`File too large (max ${MAX_FILE_BYTES / (1024 * 1024)} MB).`));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      const comma = String(dataUrl).indexOf(",");
      const raw =
        comma >= 0 ? String(dataUrl).slice(comma + 1) : String(dataUrl);
      const formatGuess = file.type === "image/png" ? "png" : "jpeg";
      resolve({ base64: raw, format: formatGuess, name: file.name });
    };
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}

const Automed_UI = ({ serviceClient, isComplete }) => {
  const [healthText, setHealthText] = useState(null);
  const [healthError, setHealthError] = useState(null);

  const [classNames, setClassNames] = useState([]);
  const [classAuthenticFlags, setClassAuthenticFlags] = useState([]);
  const [classesError, setClassesError] = useState(null);
  const [classesLoaded, setClassesLoaded] = useState(false);

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [predictLoading, setPredictLoading] = useState(false);
  const [predictResult, setPredictResult] = useState(null);
  const [predictError, setPredictError] = useState(null);

  const [batchFiles, setBatchFiles] = useState([]);
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchResults, setBatchResults] = useState(null);
  const [batchError, setBatchError] = useState(null);

  const loadClasses = useCallback(() => {
    setClassesError(null);
    const methodDescriptor = AutomedService.ListClasses;
    const request = new methodDescriptor.requestType();
    serviceClient.unary(methodDescriptor, {
      request,
      preventCloseServiceOnEnd: false,
      onEnd: (response) => {
        const { message, status, statusMessage } = response;
        setClassesLoaded(true);
        if (status !== 0) {
          setClassesError(statusMessage || "ListClasses failed");
          setClassNames([]);
          setClassAuthenticFlags([]);
          return;
        }
        const names = message.getClassNamesList ? message.getClassNamesList() : [];
        const auth = message.getIsAuthenticList ? message.getIsAuthenticList() : [];
        setClassNames(names || []);
        setClassAuthenticFlags(auth || []);
      }
    });
  }, [serviceClient]);

  useEffect(() => {
    loadClasses();
  }, [loadClasses]);

  const runHealth = () => {
    setHealthError(null);
    setHealthText(null);
    const methodDescriptor = AutomedService.HealthCheck;
    const request = new methodDescriptor.requestType();
    serviceClient.unary(methodDescriptor, {
      request,
      preventCloseServiceOnEnd: false,
      onEnd: (response) => {
        const { message, status, statusMessage } = response;
        if (status !== 0) {
          setHealthError(statusMessage || "HealthCheck failed");
          return;
        }
        const statusStr = message.getStatus ? message.getStatus() : "";
        const msgStr = message.getMessage ? message.getMessage() : "";
        setHealthText([statusStr, msgStr].filter(Boolean).join(" — ") || "OK");
      }
    });
  };

  const onFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    setPredictResult(null);
    setPredictError(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (!f) {
      setFile(null);
      setPreviewUrl(null);
      return;
    }
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const runPredict = () => {
    if (!file) {
      setPredictError("Choose an image first (JPEG or PNG).");
      return;
    }
    setPredictLoading(true);
    setPredictError(null);
    setPredictResult(null);
    fileToBase64Payload(file)
      .then(({ base64, format }) => {
        const methodDescriptor = AutomedService.Predict;
        const request = new methodDescriptor.requestType();
        request.setImageBase64(base64);
        request.setImageFormat(format);
        serviceClient.unary(methodDescriptor, {
          request,
          preventCloseServiceOnEnd: false,
          onEnd: (response) => {
            setPredictLoading(false);
            const { message, status, statusMessage } = response;
            if (status !== 0) {
              setPredictError(statusMessage || "Predict failed (daemon or network).");
              return;
            }
            setPredictResult(message);
          }
        });
      })
      .catch((err) => {
        setPredictLoading(false);
        setPredictError(err.message || String(err));
      });
  };

  const onBatchFilesChange = (e) => {
    const list = e.target.files ? Array.from(e.target.files) : [];
    setBatchResults(null);
    setBatchError(null);
    setBatchFiles(list.slice(0, 5));
  };

  const runPredictBatch = () => {
    if (!batchFiles.length) {
      setBatchError("Select 1–5 images for batch.");
      return;
    }
    setBatchLoading(true);
    setBatchError(null);
    setBatchResults(null);
    Promise.all(batchFiles.map((f) => fileToBase64Payload(f)))
      .then((payloads) => {
        const batchDescriptor = AutomedService.PredictBatch;
        const predictDescriptor = AutomedService.Predict;
        const PredictRequestClass = predictDescriptor.requestType;
        const request = new batchDescriptor.requestType();
        const inner = payloads.map(({ base64, format }) => {
          const r = new PredictRequestClass();
          r.setImageBase64(base64);
          r.setImageFormat(format);
          return r;
        });
        request.setRequestsList(inner);

        serviceClient.unary(batchDescriptor, {
          request,
          preventCloseServiceOnEnd: false,
          onEnd: (response) => {
            setBatchLoading(false);
            const { message, status, statusMessage } = response;
            if (status !== 0) {
              setBatchError(statusMessage || "PredictBatch failed");
              return;
            }
            const preds = message.getPredictionsList ? message.getPredictionsList() : [];
            setBatchResults(preds);
          }
        });
      })
      .catch((err) => {
        setBatchLoading(false);
        setBatchError(err.message || String(err));
      });
  };

  const renderPredictCard = (msg, idx) => {
    if (!msg) return null;
    const name = msg.getClassName ? msg.getClassName() : "";
    const prob = msg.getProbability ? msg.getProbability() : 0;
    const auth = msg.getIsAuthentic !== undefined && msg.getIsAuthentic !== null ? msg.getIsAuthentic() : null;
    const pct = typeof prob === "number" ? (prob <= 1 ? prob * 100 : prob) : 0;
    return (
      <div key={idx} className="am-result-row">
        <div className="am-result-class">{name || "—"}</div>
        <div className="am-result-prob">{typeof prob === "number" ? pct.toFixed(1) : "—"}%</div>
        {auth !== null && (
          <span className={auth ? "am-badge am-badge-ok" : "am-badge am-badge-bad"}>
            {auth ? "Consistent with authentic" : "Review — possible concern"}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="am-root">
      <div className="am-hero">
        <div className="am-hero-mark" aria-hidden="true" />
        <div className="am-hero-text">
          <p className="am-kicker">MediLink companion · marketplace demo</p>
          <h1 className="am-title">Automed</h1>
          <p className="am-sub">Smart Medication Companion — medication image analysis demo</p>
        </div>
      </div>

      <section className="am-toolbar">
        <div className="am-tool-card">
          <h2 className="am-h2">Service</h2>
          <div className="am-row">
            <StyledButton btnText="HealthCheck" variant="outlined" onClick={runHealth} />
            <StyledButton btnText="Refresh classes" variant="outlined" onClick={loadClasses} />
          </div>
          {healthError && <p className="am-err">{healthError}</p>}
          {healthText && <p className="am-ok">{healthText}</p>}
        </div>
        <div className="am-tool-card">
          <h2 className="am-h2">Model labels</h2>
          {classesError && <p className="am-err">{classesError}</p>}
          {!classesLoaded && !classesError && <p className="am-muted">Loading…</p>}
          {classesLoaded && classNames.length === 0 && !classesError && (
            <p className="am-muted">No labels returned (single-class model is OK).</p>
          )}
          {classNames.length > 0 && (
            <ul className="am-class-list">
              {classNames.map((n, i) => (
                <li key={i}>
                  <span className="am-class-name">{n}</span>
                  {classAuthenticFlags[i] !== undefined && (
                    <span className={classAuthenticFlags[i] ? "am-mini-ok" : "am-mini-warn"}>
                      {classAuthenticFlags[i] ? "authentic mapping" : "review mapping"}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <main className="am-main">
        <div className="am-panel">
          <h2 className="am-h2">Single image</h2>
          <p className="am-muted">
            Upload a photo of the medication / packaging (JPEG or PNG). The model uses 96×96 grayscale — keep the subject
            in frame.
          </p>
          <input type="file" accept="image/jpeg,image/png" onChange={onFileChange} className="am-file" />
          {previewUrl && (
            <div className="am-preview-wrap">
              <img src={previewUrl} alt="Preview" className="am-preview" />
            </div>
          )}
          {predictError && <div className="am-err-block">{predictError}</div>}
          <div className="am-row">
            <StyledButton
              btnText={predictLoading ? "Analyzing…" : "Run Predict"}
              variant="contained"
              onClick={runPredict}
              disabled={predictLoading || !file}
            />
          </div>
        </div>

        <div className="am-panel am-panel-result">
          <h2 className="am-h2">Result</h2>
          {!predictResult && !predictError && (
            <p className="am-muted">Run Predict to see class, confidence, and authenticity hint.</p>
          )}
          {predictResult && (
            <div className="am-verdict">
              {renderPredictCard(predictResult, 0)}
              <p className="am-disclaimer">
                Demo only — not a medical device. Use for marketplace testing; clinical decisions require validated systems.
              </p>
            </div>
          )}
        </div>
      </main>

      <section className="am-batch">
        <h2 className="am-h2">Batch (optional)</h2>
        <p className="am-muted">Up to 5 images — same order as results.</p>
        <input type="file" accept="image/jpeg,image/png" multiple onChange={onBatchFilesChange} className="am-file" />
        {batchError && <div className="am-err-block">{batchError}</div>}
        <StyledButton
          btnText={batchLoading ? "Batch running…" : "PredictBatch"}
          variant="outlined"
          onClick={runPredictBatch}
          disabled={batchLoading || batchFiles.length === 0}
        />
        {batchResults && batchResults.length > 0 && (
          <div className="am-batch-results">
            {batchResults.map((m, i) => renderPredictCard(m, i))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Automed_UI;
