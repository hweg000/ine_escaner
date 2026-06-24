import { importShared } from './__federation_fn_import-gVVR6EuA.js';
import { r as reactExports } from './index-Dm_EQZZA.js';

var jsxRuntime = {exports: {}};

var reactJsxRuntime_production_min = {};

/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f=reactExports,k=Symbol.for("react.element"),l=Symbol.for("react.fragment"),m=Object.prototype.hasOwnProperty,n=f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,p={key:true,ref:true,__self:true,__source:true};
function q(c,a,g){var b,d={},e=null,h=null;void 0!==g&&(e=""+g);void 0!==a.key&&(e=""+a.key);void 0!==a.ref&&(h=a.ref);for(b in a)m.call(a,b)&&!p.hasOwnProperty(b)&&(d[b]=a[b]);if(c&&c.defaultProps)for(b in a=c.defaultProps,a) void 0===d[b]&&(d[b]=a[b]);return {$$typeof:k,type:c,key:e,ref:h,props:d,_owner:n.current}}reactJsxRuntime_production_min.Fragment=l;reactJsxRuntime_production_min.jsx=q;reactJsxRuntime_production_min.jsxs=q;

{
  jsxRuntime.exports = reactJsxRuntime_production_min;
}

var jsxRuntimeExports = jsxRuntime.exports;

const {useRef,useState: useState$1} = await importShared('react');

const ACCEPT = "image/jpeg,image/png,image/webp";
function ImageBox({ label, file, onChange }) {
  const inputRef = useRef();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      onClick: () => inputRef.current.click(),
      style: {
        border: "2px dashed #ccc",
        borderRadius: 12,
        padding: 16,
        textAlign: "center",
        cursor: "pointer",
        background: file ? "#f0fdf4" : "#fafafa",
        transition: "background 0.2s",
        minHeight: 140,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            ref: inputRef,
            type: "file",
            accept: ACCEPT,
            style: { display: "none" },
            onChange: (e) => onChange(e.target.files[0] || null)
          }
        ),
        file ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: URL.createObjectURL(file),
              alt: label,
              style: { maxHeight: 120, maxWidth: "100%", borderRadius: 8, objectFit: "contain" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 12, color: "#16a34a" }, children: [
            "✓ ",
            file.name
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 32 }, children: "📷" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 600 }, children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12, color: "#888" }, children: "Haz clic para seleccionar imagen" })
        ] })
      ]
    }
  );
}
function IneUploader({ onSubmit, loading }) {
  const [front, setFront] = useState$1(null);
  const [back, setBack] = useState$1(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!front) return;
    onSubmit({ front, back });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, style: { display: "flex", flexDirection: "column", gap: 16 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ImageBox, { label: "Frente de INE", file: front, onChange: setFront }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ImageBox, { label: "Reverso de INE", file: back, onChange: setBack })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { margin: 0, fontSize: 12, color: "#888", textAlign: "center" }, children: "Asegúrate de que las 4 esquinas del documento sean visibles." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "submit",
        disabled: !front || loading,
        style: {
          padding: "12px 24px",
          background: !front || loading ? "#9ca3af" : "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          fontWeight: 700,
          fontSize: 16,
          cursor: !front || loading ? "not-allowed" : "pointer",
          transition: "background 0.2s"
        },
        children: loading ? "⏳ Verificando..." : "🔍 Verificar INE"
      }
    )
  ] });
}

const STATUS_CONFIG = {
  Approved: { color: "#16a34a", bg: "#f0fdf4", icon: "✅", label: "INE VÁLIDA" },
  Declined: { color: "#dc2626", bg: "#fef2f2", icon: "❌", label: "INE INVÁLIDA / RECHAZADA" },
  default: { color: "#d97706", bg: "#fffbeb", icon: "⚠️", label: "REVISIÓN REQUERIDA" }
};
function Field({ label, value }) {
  if (!value) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8, padding: "6px 0", borderBottom: "1px solid #f0f0f0" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#6b7280", minWidth: 140, fontSize: 13 }, children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 600, fontSize: 13 }, children: value })
  ] });
}
function VerificationResult({ data, onReset }) {
  const idv = data?.id_verification;
  if (!idv) return null;
  const cfg = STATUS_CONFIG[idv.status] ?? STATUS_CONFIG.default;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 16 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        style: {
          background: cfg.bg,
          border: `2px solid ${cfg.color}`,
          borderRadius: 12,
          padding: "16px 20px",
          textAlign: "center"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 36 }, children: cfg.icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: cfg.color, fontWeight: 800, fontSize: 18, marginTop: 4 }, children: cfg.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#6b7280", fontSize: 12, marginTop: 4 }, children: [
            "ID sesión: ",
            data.request_id?.slice(0, 8),
            "…"
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        style: {
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: "16px 20px"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { margin: "0 0 12px", fontSize: 14, color: "#374151" }, children: "📋 Datos extraídos" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Nombre completo", value: idv.full_name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Fecha de nacimiento", value: idv.date_of_birth }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Edad", value: idv.age != null ? `${idv.age} años` : null }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Género", value: idv.gender === "M" ? "Masculino" : idv.gender === "F" ? "Femenino" : idv.gender }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Tipo de documento", value: idv.document_type }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Número de documento", value: idv.document_number }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "CURP / Número personal", value: idv.personal_number }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Vigencia", value: idv.expiration_date }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Emisión", value: idv.date_of_issue }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "País emisor", value: idv.issuing_state_name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Dirección", value: idv.address })
        ]
      }
    ),
    idv.warnings?.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        style: {
          background: "#fffbeb",
          border: "1px solid #fbbf24",
          borderRadius: 12,
          padding: "12px 16px"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { margin: "0 0 8px", fontSize: 13, color: "#92400e" }, children: "⚠️ Advertencias" }),
          idv.warnings.map((w, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 12, color: "#78350f", marginBottom: 4 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: w.risk }),
            " — ",
            w.short_description
          ] }, i))
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: onReset,
        style: {
          padding: "10px 20px",
          background: "transparent",
          color: "#2563eb",
          border: "2px solid #2563eb",
          borderRadius: 8,
          fontWeight: 600,
          cursor: "pointer",
          fontSize: 14
        },
        children: "← Verificar otra INE"
      }
    )
  ] });
}

const {useState} = await importShared('react');
const BACKEND_URL = "";
function IneVerification() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const handleSubmit = async ({ front, back }) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const form = new FormData();
      form.append("front_image", front);
      if (back) form.append("back_image", back);
      const res = await fetch(`${BACKEND_URL}/api/verify-ine`, {
        method: "POST",
        body: form
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `Error ${res.status}`);
      }
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        fontFamily: "system-ui, -apple-system, sans-serif",
        maxWidth: 560,
        margin: "0 auto",
        padding: 24,
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", marginBottom: 24 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 40 }, children: "🪪" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { margin: "8px 0 4px", fontSize: 20 }, children: "Verificación de INE" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { margin: 0, color: "#6b7280", fontSize: 13 }, children: "Sube las fotos de tu credencial para verificar su autenticidad" })
        ] }),
        error && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              background: "#fef2f2",
              border: "1px solid #fca5a5",
              borderRadius: 8,
              padding: "10px 14px",
              marginBottom: 16,
              color: "#dc2626",
              fontSize: 13
            },
            children: [
              "❌ ",
              error
            ]
          }
        ),
        result ? /* @__PURE__ */ jsxRuntimeExports.jsx(VerificationResult, { data: result, onReset: () => {
          setResult(null);
          setError(null);
        } }) : /* @__PURE__ */ jsxRuntimeExports.jsx(IneUploader, { onSubmit: handleSubmit, loading })
      ]
    }
  );
}

export { IneVerification as default, jsxRuntimeExports as j };
