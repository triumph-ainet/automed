# How to get `weights.bin` for the AutoMed model

The server needs **both** `model.json` and **`weights.bin`** in `src/model/` to convert the TF.js model to Keras. **`weights.bin` is gitignored** (not shipped in the public repo, same pattern as the service provider’s clone). You add it locally after clone.

## Where is Teachable Machine?

**Teachable Machine** is Google’s browser-based tool for training simple ML models (image, sound, pose):

- **Homepage:** https://teachablemachine.withgoogle.com/
- **This project’s model:** https://teachablemachine.withgoogle.com/models/DPVgfcKq5/

The frontend in `src/frontend/Scanner.jsx` loads that model by URL (model.json + metadata). The **weights** are stored separately; you need to get them into the repo.

---

## Option 1: Download from the hosted model URL (if available)

Teachable Machine may serve the weight file at the same base URL as the model. From the **automed** repo root, try:

```bash
cd automed/src/model
curl -L -o weights.bin "https://teachablemachine.withgoogle.com/models/DPVgfcKq5/weights.bin"
```

**Checked:** For this model (DPVgfcKq5), that URL returns an XML error (`NoSuchKey` / "The specified key does not exist"), not the real weights. So for this project you must use **Option 2 or 3**.

---

## Option 2: Export from Teachable Machine (if you have the project)

If you (or the service owner) have the **original project** in Teachable Machine:

1. Open **https://teachablemachine.withgoogle.com/** in Chrome or Safari (desktop).
2. Open the project that contains this model (or train a new image model and export it).
3. Click **Export model** (or **Export**).
4. Choose **TensorFlow.js**.
5. Choose **Standard (recommended)** or **Quantized**.
6. Click **Download** – you get a **.zip** with:
   - `model.json`
   - `weights.bin` (or sometimes `group1-shard1of1.bin`)

Then:

```bash
cd /path/to/automed
unzip /path/to/teachable-machine-export.zip -d /tmp/tm_export
cp /tmp/tm_export/model.json src/model/
cp /tmp/tm_export/weights.bin src/model/
# If the file is named group1-shard1of1.bin instead:
# cp /tmp/tm_export/group1-shard1of1.bin src/model/weights.bin
```

After that, run `./convert_tfjs_to_keras.sh` from `server/` and restart the gRPC server.

---

## Option 3: Get the export from whoever created the model

If you don’t have the project and Option 1 doesn’t work, ask the person who trained the model (or who owns the AutoMed service) to:

1. Open the project in Teachable Machine.
2. Export model → TensorFlow.js → Download.
3. Send you the zip (or at least `weights.bin` and, if different, the exact `model.json` they used).

Put `weights.bin` in `automed/src/model/` next to the existing `model.json`.

---

## Check that you have both files

```bash
ls -la automed/src/model/
# You want: model.json, metadata.json, weights.bin (or the shard file renamed to weights.bin)
```

Then run `server/convert_tfjs_to_keras.sh` and restart the server for real inference.
