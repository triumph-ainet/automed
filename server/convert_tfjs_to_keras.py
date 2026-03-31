#!/usr/bin/env python3
"""
Convert TF.js model (src/model/) to Keras SavedModel. Run from server/.
Fixes pkg_resources import for environments where setuptools does not provide it.
"""
import sys
import os

# Stub pkg_resources before any tensorflow/tensorflowjs import (for tensorflow_hub)
try:
    import pkg_resources
except ImportError:
    try:
        from packaging import version
        import types
        pkg_resources = types.ModuleType("pkg_resources")
        pkg_resources.parse_version = version.parse
        sys.modules["pkg_resources"] = pkg_resources
    except ImportError:
        sys.exit("Install packaging: pip install packaging")

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.join(SCRIPT_DIR, "..")
TFJS_DIR = os.path.join(REPO_ROOT, "src", "model")
OUT_DIR = os.path.join(SCRIPT_DIR, "model_keras")

if not os.path.isfile(os.path.join(TFJS_DIR, "model.json")):
    sys.exit("Error: model.json not found in src/model/")
if not os.path.isfile(os.path.join(TFJS_DIR, "weights.bin")):
    sys.exit("Error: weights.bin not found in src/model/")

print("Converting TF.js model from", TFJS_DIR, "to", OUT_DIR, "...")

from tensorflowjs.converters import converter

# converter.convert() expects argv-style list. For tfjs_layers_model the input must be model.json.
MODEL_JSON = os.path.join(TFJS_DIR, "model.json")
converter.convert([
    MODEL_JSON,
    OUT_DIR,
    "--input_format=tfjs_layers_model",
    "--output_format=keras_saved_model",
])

print("Done. Load in Python with: tf.keras.models.load_model(%r)" % OUT_DIR)
