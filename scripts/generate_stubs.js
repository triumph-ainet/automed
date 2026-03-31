/**
 * Generate JS stubs from server/automed.proto for the AI UI Constructor (grpc-web).
 * Run from automed/: npm install && npm run generate-stubs
 * Requires: protoc on PATH, same stack as CKD/MedConnect (ts-protoc-gen).
 */
const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const root = path.join(__dirname, "..");
const protoRel = path.join("server", "automed.proto");
const outDir = path.join(root, "ai_ui");
const packageName = "automed";
const orgId = "AJ_dev_outreach_test_1";
const serviceId = "automed";
const namespacePrefix = `${packageName}_${orgId}_${serviceId}`;

const protoPath = path.join(root, protoRel);
const pluginPath = path.join(
  root,
  "node_modules",
  ".bin",
  "protoc-gen-ts" + (process.platform === "win32" ? ".cmd" : "")
);

if (!fs.existsSync(protoPath)) {
  console.error("Error: server/automed.proto not found. Run from automed/.");
  process.exit(1);
}
if (!fs.existsSync(pluginPath)) {
  console.error("Error: Run npm install first (ts-protoc-gen / protoc-gen-ts not found).");
  process.exit(1);
}

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const jsOut = `import_style=commonjs,binary,namespace_prefix=${namespacePrefix}:${outDir}`;
const tsOut = `service=grpc-web:${outDir}`;
const includeDir = path.join(root, "server");
const cmd = [
  "protoc",
  `-I${includeDir}`,
  `--plugin=protoc-gen-ts=${pluginPath}`,
  `--js_out=${jsOut}`,
  `--ts_out=${tsOut}`,
  "automed.proto"
].join(" ");

const binDir = path.join(root, "node_modules", ".bin");
const pathSep = process.platform === "win32" ? ";" : ":";
const env = { ...process.env, PATH: binDir + pathSep + (process.env.PATH || "") };

console.log("Generating stubs into ai_ui/ ...");
process.chdir(path.join(root, "server"));
execSync(cmd, { stdio: "inherit", env });
console.log(
  "Done. Upload automed_pb.js and automed_pb_service.js (or .ts) from ai_ui/ to the AI UI Constructor."
);
