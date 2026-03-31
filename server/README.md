# AutoMed gRPC server

Medication image analysis service for SingularityNET. Exposes **HealthCheck**, **Predict**, **PredictBatch**, and **ListClasses** (image → class + probability + optional authenticity hint).

## Setup (local or VPS)

```bash
cd server
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install --no-cache-dir -r requirements.txt
```

On small disks, prefer `--no-cache-dir` for pip. If install fails with “no space left on device”, free space under `/` and in `/home` (apt cache, old `.venv` trees, `~/.cache/pip`), then retry.

## Generate stubs (if you change the proto)

```bash
python -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. automed.proto
```

Or run `./generate_stubs.sh` (after `chmod +x generate_stubs.sh`).

## Run server

```bash
python grpc_server.py
```

Listens on port **50053** by default. Set `GRPC_PORT` to override.

## Test with client

```bash
python grpc_client.py
python grpc_client.py --list-classes
python grpc_client.py --image path/to/image.jpg
python grpc_client.py --images a.jpg b.jpg
```

## Real inference

The server loads a converted model from `server/model_keras/` (SavedModel). If missing or load fails, it falls back to mock responses.

1. **Weights:** Ensure `src/model/` has `model.json` and **`weights.bin`** (Teachable Machine export). **`weights.bin` is not in git** (same as the upstream provider repo); get the file from the provider or your own TM export. See **`server/GET_WEIGHTS.md`**.
2. **Convert TF.js → Keras SavedModel:**  
   `python convert_tfjs_to_keras.py`  
   (Requires `tensorflow` and `tensorflowjs`; writes `server/model_keras/`.)
3. **Restart the server.**

The Python loader uses **Keras 3–compatible** loading (`TFSMLayer`) for the SavedModel produced by the converter.

## Deploy on a Linux VPS (systemd)

Typical layout: code under `/home/<user>/automed/server`, venv at `/home/<user>/automed/server/.venv`.

### 1. gRPC service (`automed-grpc`)

Copy the unit file to systemd (edit paths if yours differ):

```bash
sudo cp /home/<user>/automed/server/automed-grpc.service /etc/systemd/system/automed-grpc.service
sudo systemctl daemon-reload
sudo systemctl enable --now automed-grpc
sudo systemctl status automed-grpc --no-pager
```

`automed-grpc.service` should point `ExecStart` at `.venv/bin/python` and `grpc_server.py` in that tree. If you see **status=203/EXEC**, the venv path is wrong or venv was never created on the VPS.

### 2. SingularityNET daemon (`snetd`)

**Do not commit** real `snetd.automed.config.json` (it can contain private keys and RPC URLs). Use **`snetd.automed.config.example.json`** as a template; copy to `snetd.automed.config.json` on the server only, fill in org/service/SSL/etcd as needed.

Example dedicated unit:

```bash
sudo cp …  # create /etc/systemd/system/snetd-automed.service with:
# ExecStart=/usr/local/bin/snetd --config /home/<user>/automed/server/snetd.automed.config.json
sudo systemctl daemon-reload
sudo systemctl enable --now snetd-automed
sudo systemctl status snetd-automed --no-pager
```

Confirm listening ports (example):

```bash
sudo ss -tlnp | grep -E '50053|10000'
```

- **50053** — gRPC backend  
- **10000** (or your `daemon_endpoint`) — HTTPS front for the AI UI / clients via `snetd`

`service_endpoint` in the daemon config should target the gRPC server, e.g. **`grpc://127.0.0.1:50053`** (not `http://`).

### 3. Firewall / instructor checks

Only the ports your class exposes (e.g. **10000** for the daemon) need to be reachable from the AI UI Constructor or public testers. gRPC **50053** is usually localhost-only behind `snetd`.

## Notes for instructors / reviewers

- **Integration scope:** This folder adds the **gRPC + marketplace** path. The existing **`src/frontend/`** React app is unchanged; inference in-browser there is separate from this server.
- **Model metadata:** Class names come from **`src/model/metadata.json`**. If `labels` contains only **`Class 1`**, `ListClasses` and predictions are **technically correct** but **not semantically rich** for multi-class “authentic vs counterfeit” demos until the provider ships a multi-label export or documents a one-class threshold rule.
- **Protobuf / Python:** Pin compatible `grpcio-tools` and `protobuf` versions per `requirements.txt` so generated stubs load without version mismatch errors.

## What images to use for testing

- **JPEG or PNG**; server resizes to **96×96** grayscale.
- **Best:** Medication / packaging photos consistent with training data.
- **Sanity check:** Any small photo still exercises the pipeline; interpretation quality depends on the trained model.

## Proto (summary)

| RPC | Role |
|-----|------|
| HealthCheck | Readiness |
| Predict | One image (base64) → class, probability, `is_authentic` |
| PredictBatch | N images → N predictions |
| ListClasses | Labels from metadata |
