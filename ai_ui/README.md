# AutoMed — AI UI Constructor (Sandbox v2)

Demo UI for the **AutomedService** gRPC API (HealthCheck, Predict, PredictBatch, ListClasses). Stubs **must** be generated from `server/automed.proto` — do not hand-write `*_pb.js`.

**Visual direction:** Light gradient, DM Sans typography, fingerprint-style hero mark, and black primary actions — aligned with MediLink / **automed.tech** screenshots (marketplace demo only; not the full provider app).

**Haven’t opened the Constructor yet?** Generate stubs locally first (`npm run generate-stubs` below), then follow §2 in order: upload stubs → paste `index.js` + `style.css` → Compile → set Org / ServiceId / Endpoint → test HealthCheck + Predict.

---

## 1. Generate stub files

From the **`automed/`** directory (this folder’s parent):

```bash
cd automed
npm install
npm run generate-stubs
```

Prerequisites: **`protoc`** on your `PATH`, same as **CKD** / **MedConnect** (see `ckd_ai_tools_api/GENERATING_STUBS.md` if needed).

Outputs in **`automed/ai_ui/`**:

- `automed_pb.js`
- `automed_pb_service.js` (grpc-web service stubs)

---

## 2. AI UI Constructor workflow

1. Open [AI UI Constructor](https://ai-ui-constructor.singularitynet.io/) and sign in (MetaMask + Sepolia).
2. **New Project**
3. **Upload** the generated `automed_pb.js` and `automed_pb_service.js`
4. Paste **`index.js`** and **`style.css`** from this folder into the project editor
5. **Compile** — in the preview, set:
   - **OrganisationID:** `AJ_dev_outreach_test_1`
   - **ServiceId:** `automed`
   - **Endpoint:** `https://devtraining4.deep-lab.ai:10000` (or your published daemon HTTPS URL + port)
6. Test: **HealthCheck**, **Refresh classes**, upload a **JPEG/PNG** and **Run Predict**
7. **Export** project → `.zip` → **Publish** demo UI in Publisher Portal

---

## 3. What this UI does

| Control | RPC | Notes |
|--------|-----|--------|
| HealthCheck | `HealthCheck` | Quick reachability |
| Refresh classes | `ListClasses` | Shows model label list + optional authentic flags |
| Run Predict | `Predict` | Single image → class, confidence, authenticity hint |
| PredictBatch | `PredictBatch` | Optional 1–5 images |

**Error handling:** All unary calls check `status !== 0` and show `statusMessage` (same pattern as CKD / MedConnect). Client-side checks: file size (max 4 MB), missing file, read errors.

**Disclaimer:** Copy in the UI states this is a **marketplace demo**, not a clinical device.

---

## 4. If Compile fails on import

- Ensure stub names match the import: `import { AutomedService } from "./automed_pb_service";`
- If the generated file exports a **default** or a different symbol name, adjust the import line in `index.js` to match what `automed_pb_service.js` exports.

---

## Summary

| Step | Action |
|------|--------|
| 1 | `cd automed && npm install && npm run generate-stubs` |
| 2 | Upload `automed_pb.js`, `automed_pb_service.js` to Constructor |
| 3 | Paste `index.js`, `style.css` |
| 4 | Compile → set Org, ServiceId, Endpoint |
| 5 | Export → Publish in Publisher Portal |
