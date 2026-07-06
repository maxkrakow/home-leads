// Logo + featured photo uploads. Uploads to Firebase Storage under
// clients/{clientId}/uploads/{kind}/{filename}, and adds a doc to the
// uploads subcollection so the tab list stays in Firestore.
import React, { useRef, useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addDoc, collection, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { db, storage } from "../../firebase";
import { usePortalAuth } from "../portalAuth";
import { Card, formatDate } from "./uiBits";

export default function Uploads({ view }) {
  const { client, uploads } = view;
  const { isDemo } = usePortalAuth();
  const [localUploads, setLocalUploads] = useState(uploads);
  const [uploading, setUploading] = useState(null);
  const [progress, setProgress] = useState(0);
  const logoInput = useRef(null);
  const photoInput = useRef(null);

  const list = uploading || isDemo ? localUploads : uploads; // during upload keep local mirror

  const handlePick = async (fileList, kind) => {
    const file = fileList?.[0];
    if (!file) return;
    if (isDemo) {
      alert("Demo mode — uploads aren't saved to Storage.");
      return;
    }
    if (!client?.id) return;
    setUploading(kind);
    setProgress(0);
    try {
      const safe = file.name.replace(/[^\w.\-]/g, "_");
      const path = `clients/${client.id}/uploads/${kind}/${Date.now()}_${safe}`;
      const sref = ref(storage, path);
      const task = uploadBytesResumable(sref, file);
      await new Promise((resolve, reject) => {
        task.on(
          "state_changed",
          (snap) => setProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
          reject,
          resolve
        );
      });
      const url = await getDownloadURL(task.snapshot.ref);
      const docRef = await addDoc(collection(db, "clients", client.id, "uploads"), {
        kind,
        fileName: file.name,
        fileUrl: url,
        storagePath: path,
        contentType: file.type || null,
        size: file.size,
        uploadedAt: serverTimestamp(),
      });
      setLocalUploads((prev) => [
        { id: docRef.id, kind, fileName: file.name, fileUrl: url, uploadedAt: new Date() },
        ...prev,
      ]);
    } catch (err) {
      console.error(err);
      alert("Upload failed: " + (err.message || err));
    } finally {
      setUploading(null);
      setProgress(0);
    }
  };

  const removeUpload = async (u) => {
    if (isDemo) return;
    if (!client?.id) return;
    if (!window.confirm(`Remove ${u.fileName}?`)) return;
    try {
      await deleteDoc(doc(db, "clients", client.id, "uploads", u.id));
      setLocalUploads((prev) => prev.filter((x) => x.id !== u.id));
    } catch (err) {
      console.error(err);
      alert("Could not remove: " + (err.message || err));
    }
  };

  const logos = list.filter((u) => u.kind === "logo");
  const photos = list.filter((u) => u.kind === "photo");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Logo & Photos</h1>
        <p className="text-sm text-gray-500 mt-1">Drop your logo and any job photos you want featured on flyers.</p>
      </div>

      {uploading && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Uploading {uploading}… {progress}%
        </div>
      )}

      <Card
        title="Logo"
        subtitle="Highest-res PNG/SVG you have. Transparent background is ideal."
        action={
          <button
            onClick={() => logoInput.current?.click()}
            disabled={uploading}
            className="rounded-full bg-emerald-600 text-white text-xs font-semibold px-4 py-2 hover:bg-emerald-700 disabled:opacity-50"
          >
            Upload logo
          </button>
        }
      >
        <input ref={logoInput} type="file" accept="image/*,.svg" className="hidden" onChange={(e) => handlePick(e.target.files, "logo")} />
        {logos.length === 0 ? (
          <p className="text-xs text-gray-400 italic">No logo uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {logos.map((u) => (
              <UploadCard key={u.id} u={u} onRemove={() => removeUpload(u)} disabled={isDemo} />
            ))}
          </div>
        )}
      </Card>

      <Card
        title="Featured photos"
        subtitle="Truck wraps, before/afters, install shots. We'll pick the strongest for your flyer."
        action={
          <button
            onClick={() => photoInput.current?.click()}
            disabled={uploading}
            className="rounded-full bg-emerald-600 text-white text-xs font-semibold px-4 py-2 hover:bg-emerald-700 disabled:opacity-50"
          >
            Add photo
          </button>
        }
      >
        <input ref={photoInput} type="file" accept="image/*" className="hidden" onChange={(e) => handlePick(e.target.files, "photo")} />
        {photos.length === 0 ? (
          <p className="text-xs text-gray-400 italic">No photos yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {photos.map((u) => (
              <UploadCard key={u.id} u={u} onRemove={() => removeUpload(u)} disabled={isDemo} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function UploadCard({ u, onRemove, disabled }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden group relative">
      <a href={u.fileUrl} target="_blank" rel="noopener noreferrer">
        <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
          <img src={u.fileUrl} alt="" className="max-w-full max-h-full object-contain" />
        </div>
      </a>
      <div className="px-3 py-2">
        <p className="text-xs font-medium text-gray-900 truncate">{u.fileName}</p>
        <p className="text-[10px] text-gray-400">{formatDate(u.uploadedAt)}</p>
      </div>
      {!disabled && (
        <button
          onClick={onRemove}
          className="absolute top-1.5 right-1.5 rounded-full bg-white/90 border border-gray-200 text-[10px] font-medium px-2 py-0.5 opacity-0 group-hover:opacity-100 text-gray-700 hover:text-red-600"
        >
          Remove
        </button>
      )}
    </div>
  );
}
