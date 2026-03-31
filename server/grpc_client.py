"""
AutoMed gRPC client – for local testing.
Usage:
  python grpc_client.py
  python grpc_client.py --list-classes
  python grpc_client.py --image path/to/image.jpg
  python grpc_client.py --images a.jpg b.jpg   # PredictBatch
"""

import argparse
import base64

import grpc

import automed_pb2
import automed_pb2_grpc


def main():
    parser = argparse.ArgumentParser(description="AutoMed gRPC client")
    parser.add_argument("--host", default="localhost", help="Server host")
    parser.add_argument("--port", type=int, default=50053, help="Server port")
    parser.add_argument("--image", help="Path to one image for Predict")
    parser.add_argument("--images", nargs="+", metavar="PATH", help="Paths to images for PredictBatch")
    parser.add_argument("--list-classes", action="store_true", help="Call ListClasses and print class names")
    args = parser.parse_args()

    address = f"{args.host}:{args.port}"
    with grpc.insecure_channel(address) as channel:
        stub = automed_pb2_grpc.AutomedServiceStub(channel)

        # HealthCheck
        resp = stub.HealthCheck(automed_pb2.HealthCheckRequest())
        print("HealthCheck:", resp.status, "-", resp.message)

        if args.list_classes:
            resp = stub.ListClasses(automed_pb2.ListClassesRequest())
            print("ListClasses:", list(resp.class_names))
            if resp.is_authentic:
                print("  is_authentic:", list(resp.is_authentic))

        if args.image:
            with open(args.image, "rb") as f:
                image_b64 = base64.b64encode(f.read()).decode("utf-8")
            pred = stub.Predict(
                automed_pb2.PredictRequest(image_base64=image_b64, image_format="jpeg")
            )
            print(
                "Predict:",
                pred.class_name,
                f"{pred.probability:.2%}",
                "authentic=",
                pred.is_authentic,
            )

        if args.images:
            requests = []
            for path in args.images:
                with open(path, "rb") as f:
                    image_b64 = base64.b64encode(f.read()).decode("utf-8")
                requests.append(
                    automed_pb2.PredictRequest(image_base64=image_b64, image_format="jpeg")
                )
            batch = stub.PredictBatch(automed_pb2.PredictBatchRequest(requests=requests))
            print("PredictBatch: %d predictions" % len(batch.predictions))
            for i, pred in enumerate(batch.predictions):
                print(
                    "  [%d]" % i,
                    pred.class_name,
                    f"{pred.probability:.2%}",
                    "authentic=",
                    pred.is_authentic,
                )

        if not args.list_classes and not args.image and not args.images:
            print("Options: --list-classes, --image PATH, --images PATH [PATH ...]")


if __name__ == "__main__":
    main()
