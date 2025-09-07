# Phased Implementation Plan (Fast & Practical)

## Phase 0 — Prep & Access (1–2 days)

* Add backend guard `GET /api/models/:id/edit` to verify user ownership (via DB + optional on-chain check).
* Backend returns model metadata, IPFS URL, and allowed tools.
* **Deliverable:** User can only access edit UI for models they own.

---

## Phase 1 — Viewer & Selection (3–5 days)

* Implement `ModelViewer` using **react-three-fiber**.
* Load GLB/STL with progressive LOD.
* Integrate **three-mesh-bvh** for efficient raycasting & face/triangle selection.
* Add highlight system for selected regions.
* **Deliverable:** Smooth viewer with reliable region/face selection + highlighting.

---

## Phase 2 — Local Edits & WASM Preview (5–8 days)

* Implement local transform tool: translate/rotate/scale selected region with ghost preview & undo stack.
* Add **WASM (Rust)** module for BVH ops, Laplacian smoothing, and simple remeshing.
* Optimize for preview latency `<100 ms`.
* **Deliverable:** User can select region → apply transform/smooth → see instant preview. Changes saved to IPFS.

---

## Phase 3 — Mesh CSG (Drill/Cut) Proof of Concept (4–6 days)

* Implement voxel-based CSG in WASM for quick drills/cuts (fast, approximate).
* Provide UI to sketch a circle on a face → voxel subtract → remesh.
* Add fallback: **“Server refine”** button submits precise job.
* **Deliverable:** Drill/cut tool works client-side for most edits, with server fallback available.

---

## Phase 4 — Server Job System & Worker (4–7 days)

* Add Job API: `POST /api/jobs` (payload: modelRef + opLog).
* Use **BullMQ + Redis** for job queueing.
* Worker prototype: performs remesh/robust boolean (Rust/C++ or wrapped lib), uploads result to IPFS, returns job result.
* Add **WebSocket notifications** for job progress.
* **Deliverable:** Heavy edits are processed reliably; client receives progress updates & results.

---

## Phase 5 — Save Derivative & Mint Flow (3–5 days)

* When user accepts final model:

  * Export mesh → upload to IPFS.
  * Create derivative record with originalTokenId + op-log in DB.
* Optionally trigger mint flow to mint derivative NFT pointing to new metadata.
* Enforce licensing checks.
* **Deliverable:** Derivative saved and optionally minted.

---

## Phase 6 — Polish & Performance Tuning (Ongoing)

* LOD streaming.
* Memory profiling & optimization.
* Worker autoscaling.
* Caching of common derivative outputs.
* UI/UX polish.

**Outcome:** Incremental, fast-to-deliver system where users can securely view, edit, and derive 3D models with client-side responsiveness and server-backed robustness.

Tech stack & libraries (concrete)
Frontend: React + TypeScript, react-three-fiber, three-mesh-bvh, drei (helpers).
WASM: Rust + wasm-pack / wasm-bindgen for BVH + smoothing + voxel CSG.
Backend: Express + TypeScript (reuse existing code), BullMQ + Redis for jobs.
Storage: IPFS / Pinata (existing), fallback S3 if used.
DB: reuse your MongoDB (or Postgres if you prefer) for metadata & op logs.
Realtime: ws or socket.io (socket.io gives easier rooms & reconnection) — use whichever your project already uses.