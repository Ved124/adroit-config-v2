// components/admin/ImageUploader.jsx
// Thumbnail + upload/replace/remove widget for a catalog entry's `image`
// field. Uploads go to Vercel Blob via /api/admin/upload-image; existing
// /images/... paths or previously-uploaded blob URLs keep working untouched
// since this is just a string field either way.
import React, { useRef, useState } from "react";

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ImageUploader({ value, onChange }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const dataUrl = await fileToDataUrl(file);
      const res = await fetch("/api/admin/upload-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataUrl, filename: file.name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onChange(data.url);
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#64748b", marginBottom: "4px" }}>Image</label>
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        {value ? (
          <img
            src={value}
            alt=""
            style={{ width: 56, height: 56, objectFit: "cover", borderRadius: "6px", border: "1px solid #e2e8f0", background: "#f8fafc" }}
          />
        ) : (
          <div style={{ width: 56, height: 56, borderRadius: "6px", border: "1px dashed #cbd5e1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: "#94a3b8", textAlign: "center" }}>
            No image
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files?.[0])} />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            style={{ fontSize: "12px", fontWeight: 700, background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "5px 10px", cursor: uploading ? "not-allowed" : "pointer", color: "#475569" }}
          >
            {uploading ? "Uploading..." : value ? "Replace image" : "Upload image"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              disabled={uploading}
              style={{ fontSize: "12px", fontWeight: 700, background: "none", border: "none", color: "#dc2626", cursor: "pointer", padding: 0, textAlign: "left" }}
            >
              Remove image
            </button>
          )}
        </div>
      </div>
      {error && <div style={{ color: "#dc2626", fontSize: "12px", marginTop: "6px" }}>{error}</div>}
    </div>
  );
}
