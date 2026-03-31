"""
Load AutoMed model and run inference. Input: 96x96 grayscale [0,1]. Shape (1,96,96,1).
"""
import io
import json
import logging
import os
import numpy as np

logger = logging.getLogger(__name__)
SERVER_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.join(SERVER_DIR, "..")
TFJS_MODEL_DIR = os.path.join(REPO_ROOT, "src", "model")
CONVERTED_MODEL_DIR = os.path.join(SERVER_DIR, "model_keras")
METADATA_PATH = os.path.join(TFJS_MODEL_DIR, "metadata.json")
IMAGE_SIZE = 96

def _load_class_names():
    try:
        with open(METADATA_PATH) as f:
            return json.load(f).get("labels", ["Class 1"])
    except Exception:
        return ["Class 1"]

def preprocess_image(image_bytes):
    from PIL import Image
    img = Image.open(io.BytesIO(image_bytes)).convert("L")
    img = img.resize((IMAGE_SIZE, IMAGE_SIZE), Image.Resampling.BILINEAR)
    arr = np.array(img, dtype=np.float32) / 255.0
    return np.expand_dims(np.expand_dims(arr, -1), 0)

def load_model():
    import tensorflow as tf
    class_names = _load_class_names()
    if not os.path.isdir(CONVERTED_MODEL_DIR):
        logger.warning("No converted model at %s. Run convert_tfjs_to_keras.sh", CONVERTED_MODEL_DIR)
        return None, class_names
    try:
        # Keras 3 doesn't support loading legacy SavedModel via load_model().
        # The TFJS converter outputs a SavedModel directory (saved_model.pb).
        saved_model_pb = os.path.join(CONVERTED_MODEL_DIR, "saved_model.pb")
        if os.path.isfile(saved_model_pb):
            import keras

            loaded = tf.saved_model.load(CONVERTED_MODEL_DIR)
            sig_keys = list(getattr(loaded, "signatures", {}).keys())
            endpoint = "serving_default" if "serving_default" in sig_keys else (sig_keys[0] if sig_keys else "serving_default")

            layer = keras.layers.TFSMLayer(CONVERTED_MODEL_DIR, call_endpoint=endpoint)
            inputs = keras.Input(shape=(IMAGE_SIZE, IMAGE_SIZE, 1), dtype="float32")
            outputs = layer(inputs)
            model = keras.Model(inputs=inputs, outputs=outputs)
            logger.info("Loaded SavedModel via TFSMLayer from %s (endpoint=%s)", CONVERTED_MODEL_DIR, endpoint)
            return model, class_names

        model = tf.keras.models.load_model(CONVERTED_MODEL_DIR)
        logger.info("Loaded model from %s", CONVERTED_MODEL_DIR)
        return model, class_names
    except Exception as e:
        logger.warning("Model load failed: %s", e)
        return None, class_names

def predict_one(model, class_names, image_bytes):
    x = preprocess_image(image_bytes)
    preds = model.predict(x, verbose=0)
    # TFSMLayer models can return dict outputs (e.g. {"output_0": tensor}).
    if isinstance(preds, dict):
        if not preds:
            raise ValueError("Model returned empty dict outputs")
        first_key = sorted(preds.keys())[0]
        preds = preds[first_key]
    probs = np.asarray(preds).flatten()
    idx = int(np.argmax(probs))
    prob = float(probs[idx])
    name = class_names[idx] if idx < len(class_names) else "Class_%d" % idx
    is_authentic = "counterfeit" not in name.lower() and "fake" not in name.lower()
    return name, prob, is_authentic
