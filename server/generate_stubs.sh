#!/usr/bin/env bash
# Generate Python gRPC stubs from automed.proto. Run from server/ directory.
set -e
cd "$(dirname "$0")"
python -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. automed.proto
echo "Generated automed_pb2.py and automed_pb2_grpc.py"
