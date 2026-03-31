#!/usr/bin/env bash
# Convert TF.js model (src/model/) to Keras SavedModel in server/model_keras/.
# Requires: model.json and weights.bin in src/model/ (export from Teachable Machine).
set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
TFJS_DIR="$REPO_ROOT/src/model"
OUT_DIR="$SCRIPT_DIR/model_keras"

if [ ! -f "$TFJS_DIR/model.json" ]; then
  echo "Error: $TFJS_DIR/model.json not found."
  exit 1
fi
if [ ! -f "$TFJS_DIR/weights.bin" ]; then
  echo "Error: $TFJS_DIR/weights.bin not found. Export the full model from Teachable Machine (model.json + weights)."
  exit 1
fi

echo "Converting TF.js model from $TFJS_DIR to $OUT_DIR ..."
tensorflowjs_converter \
  --input_format tfjs_layers_model \
  --output_format keras_saved_model \
  "$TFJS_DIR" \
  "$OUT_DIR"

echo "Done. Load in Python with: tf.keras.models.load_model('$OUT_DIR')"
