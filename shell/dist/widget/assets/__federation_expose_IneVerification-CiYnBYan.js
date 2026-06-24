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

const STATUS_CFG = {
  Approved: { color: "#16a34a", bg: "#f0fdf4", icon: "✅" },
  Declined: { color: "#dc2626", bg: "#fef2f2", icon: "❌" },
  "In Review": { color: "#d97706", bg: "#fffbeb", icon: "⏳" },
  default: { color: "#6b7280", bg: "#f9fafb", icon: "❓" }
};
function cfg(status) {
  return STATUS_CFG[status] ?? STATUS_CFG.default;
}
function Badge({ status }) {
  const c = cfg(status);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    background: c.bg,
    color: c.color,
    border: `1px solid ${c.color}`,
    borderRadius: 20,
    padding: "3px 10px",
    fontSize: 12,
    fontWeight: 700
  }, children: [
    c.icon,
    " ",
    status
  ] });
}
function Row({ label, value }) {
  if (!value) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8, padding: "5px 0", borderBottom: "1px solid #f3f4f6" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#6b7280", minWidth: 140, fontSize: 12, flexShrink: 0 }, children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 600, fontSize: 12, wordBreak: "break-all" }, children: value })
  ] });
}
function Card({ title, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: "14px 16px"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { margin: "0 0 10px", fontSize: 13, color: "#374151" }, children: title }),
    children
  ] });
}
function SessionResult({ data, onReset }) {
  const idv = data?.id_verifications?.[0];
  const lv = data?.liveness_checks?.[0];
  const fm = data?.face_matches?.[0];
  const ip = data?.ip_analyses?.[0];
  const globalStatus = data?.status ?? "Unknown";
  const globalCfg = cfg(globalStatus);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    maxWidth: 480,
    margin: "0 auto",
    padding: "20px 16px",
    fontFamily: "system-ui, -apple-system, sans-serif",
    display: "flex",
    flexDirection: "column",
    gap: 14
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      background: globalCfg.bg,
      border: `2px solid ${globalCfg.color}`,
      borderRadius: 14,
      padding: "20px",
      textAlign: "center"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 48 }, children: globalCfg.icon }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: globalCfg.color, fontWeight: 800, fontSize: 20, marginTop: 6 }, children: globalStatus === "Approved" ? "VERIFICACIÓN EXITOSA" : globalStatus === "Declined" ? "VERIFICACIÓN FALLIDA" : globalStatus === "In Review" ? "EN REVISIÓN MANUAL" : globalStatus.toUpperCase() }),
      data?.session_id && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 10, color: globalCfg.color, marginTop: 4, opacity: 0.7 }, children: [
        "ID: ",
        data.session_id
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }, children: [
      { icon: "🪪", label: "INE", status: idv?.status },
      { icon: "🤳", label: "Liveness", status: lv?.status },
      { icon: "👤", label: "Face Match", status: fm?.status },
      { icon: "🌐", label: "IP", status: ip?.status }
    ].map(({ icon, label, status }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      textAlign: "center",
      background: "#f9fafb",
      borderRadius: 10,
      padding: "8px 4px"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 18 }, children: icon }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, color: "#6b7280", margin: "2px 0" }, children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 16 }, children: cfg(status ?? "default").icon })
    ] }, label)) }),
    idv && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { title: "📋 Documento", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Nombre", value: idv.full_name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Fecha de nacimiento", value: idv.date_of_birth }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Edad", value: idv.age != null ? `${idv.age} años` : null }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Género", value: idv.gender === "M" ? "Masculino" : idv.gender === "F" ? "Femenino" : idv.gender }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "CURP", value: idv.personal_number }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "N° documento", value: idv.document_number }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Tipo", value: idv.document_type }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Vigencia", value: idv.expiration_date }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "País emisor", value: idv.issuing_state_name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: 6 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { status: idv.status }) })
    ] }),
    lv && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { title: "🤳 Liveness", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Estado", value: lv.status }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Score", value: lv.score != null ? `${lv.score}/100` : null }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: 6 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { status: lv.status }) })
    ] }),
    fm && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { title: "👤 Face Match", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Estado", value: fm.status }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Similitud", value: fm.score != null ? `${fm.score}%` : null }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: 6 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { status: fm.status }) })
    ] }),
    idv?.warnings?.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      background: "#fffbeb",
      border: "1px solid #fbbf24",
      borderRadius: 10,
      padding: "10px 14px"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { style: { fontSize: 12, color: "#92400e" }, children: "⚠️ Advertencias" }),
      idv.warnings.map((w, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 11, color: "#78350f", marginTop: 4 }, children: [
        w.risk,
        " — ",
        w.short_description
      ] }, i))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: onReset,
        style: {
          padding: "11px 20px",
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

const {useState,useEffect,useCallback} = await importShared('react');
function extractDocData(apiData) {
  const idv = apiData?.id_verifications?.[0];
  const doc = idv?.ocr_result ?? idv?.document_data ?? {};
  const fm = apiData?.face_matches?.[0];
  const lv = apiData?.liveness_checks?.[0];
  return {
    full_name: doc.full_name ?? doc.name ?? "",
    date_of_birth: doc.date_of_birth ?? doc.birth_date ?? "",
    curp: doc.curp ?? doc.personal_number ?? "",
    document_number: doc.document_number ?? doc.id_number ?? "",
    gender: doc.gender ?? "",
    expiration_date: doc.expiration_date ?? doc.expiry_date ?? "",
    issuing_state: doc.issuing_state ?? doc.state ?? "",
    id_verification_status: idv?.status ?? "",
    liveness_status: lv?.status ?? "",
    face_match_status: fm?.status ?? "",
    face_match_score: fm?.similarity_score ?? fm?.score ?? null
  };
}
function ClientForm({ sessionId, verificationData, onSaved, onCancel }) {
  const defaults = extractDocData(verificationData);
  const [form, setForm] = useState(defaults);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  function field(label, key, type = "text") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 4 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { style: { fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase" }, children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type,
          value: form[key] ?? "",
          onChange: (e) => setForm((f) => ({ ...f, [key]: e.target.value })),
          style: {
            padding: "8px 10px",
            border: "1px solid #d1d5db",
            borderRadius: 6,
            fontSize: 13,
            fontFamily: "inherit"
          }
        }
      )
    ] }, key);
  }
  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const globalStatus = verificationData?.status ?? verificationData?.decision ?? "In Review";
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...token ? { Authorization: `Bearer ${token}` } : {}
        },
        body: JSON.stringify({
          didit_session_id: sessionId,
          verification_status: globalStatus,
          ...form
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? `Error ${res.status}`);
      onSaved(data);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontFamily: "system-ui, sans-serif" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      background: "#f0fdf4",
      border: "1px solid #86efac",
      borderRadius: 10,
      padding: "10px 14px",
      marginBottom: 16,
      fontSize: 13,
      color: "#15803d"
    }, children: "✅ Verificación exitosa — revisa y confirma los datos del cliente" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSave, style: { display: "flex", flexDirection: "column", gap: 12 }, children: [
      field("Nombre completo", "full_name"),
      field("CURP", "curp"),
      field("Fecha de nacimiento", "date_of_birth", "date"),
      field("Género (M/F)", "gender"),
      field("N° Documento", "document_number"),
      field("Vigencia INE", "expiration_date", "date"),
      field("Estado emisor", "issuing_state"),
      error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        background: "#fef2f2",
        border: "1px solid #f87171",
        borderRadius: 8,
        padding: "8px 12px",
        fontSize: 13,
        color: "#b91c1c"
      }, children: [
        "⚠️ ",
        error
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8, marginTop: 4 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: onCancel,
            style: {
              flex: 1,
              padding: "10px",
              background: "#f3f4f6",
              color: "#374151",
              border: "1px solid #d1d5db",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer"
            },
            children: "Cancelar"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "submit",
            disabled: saving,
            style: {
              flex: 2,
              padding: "10px",
              background: saving ? "#9ca3af" : "#1e3a5f",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 14,
              cursor: saving ? "not-allowed" : "pointer"
            },
            children: saving ? "Guardando..." : "💾 Guardar cliente"
          }
        )
      ] })
    ] })
  ] });
}
function IneVerification({ onClientSaved }) {
  const [state, setState] = useState("idle");
  const [sessionUrl, setSessionUrl] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const onMessage = useCallback(async (e) => {
    if (e.data?.type !== "didit-complete") return;
    const { sessionId: sid } = e.data;
    console.log("Didit callback recibido:", sid);
    setState("fetching");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/session/${sid}/result`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? `Error ${res.status}`);
      setResult(data);
      setSessionId(sid);
      setState("done");
    } catch (err) {
      setError(`Error obteniendo resultado: ${err.message}`);
      setState("error");
    }
  }, []);
  useEffect(() => {
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [onMessage]);
  async function startVerification() {
    setState("loading");
    setError(null);
    try {
      const callback = `${window.location.origin}/verification-done.html`;
      const token = localStorage.getItem("token");
      const res = await fetch("/api/start-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...token ? { Authorization: `Bearer ${token}` } : {}
        },
        body: JSON.stringify({ callback })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? `Error ${res.status}`);
      setSessionUrl(data.url);
      setSessionId(data.session_id);
      setState("verifying");
    } catch (err) {
      setError(`No se pudo iniciar la verificación: ${err.message}`);
      setState("error");
    }
  }
  function reset() {
    setState("idle");
    setSessionUrl(null);
    setSessionId(null);
    setResult(null);
    setError(null);
  }
  if (state === "verifying") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      position: "fixed",
      inset: 0,
      zIndex: 9999,
      background: "#000",
      display: "flex",
      flexDirection: "column"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 16px",
        background: "#111",
        color: "#fff"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 14 }, children: "🪪 Verificación de identidad" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: reset,
            style: {
              background: "none",
              border: "1px solid #444",
              color: "#fff",
              padding: "4px 12px",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 13
            },
            children: "✕ Cancelar"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "iframe",
        {
          src: sessionUrl,
          style: { flex: 1, border: "none", width: "100%" },
          allow: "camera; microphone; fullscreen; autoplay; encrypted-media",
          title: "Verificación Didit"
        }
      )
    ] });
  }
  if (state === "fetching") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      maxWidth: 400,
      margin: "0 auto",
      padding: 40,
      fontFamily: "system-ui, sans-serif",
      textAlign: "center"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 48, marginBottom: 16 }, children: "⏳" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "#4b5563", fontSize: 14 }, children: "Obteniendo resultado de verificación..." })
    ] });
  }
  if (state === "done" && result && onClientSaved) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      ClientForm,
      {
        sessionId,
        verificationData: result,
        onSaved: onClientSaved,
        onCancel: reset
      }
    );
  }
  if (state === "done" && result) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SessionResult, { data: result, onReset: reset });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    maxWidth: 400,
    margin: "0 auto",
    padding: 32,
    fontFamily: "system-ui, -apple-system, sans-serif",
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    textAlign: "center"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 56, marginBottom: 12 }, children: "🪪" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { margin: "0 0 8px", fontSize: 22 }, children: "Verificación de INE" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { margin: "0 0 28px", color: "#6b7280", fontSize: 14, lineHeight: 1.6 }, children: "Verificamos la identidad del cliente usando su credencial de elector (INE) y una selfie. El proceso toma menos de 2 minutos." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 28 }, children: [
      { icon: "🪪", label: "Foto de INE" },
      { icon: "🤳", label: "Selfie" },
      { icon: "🔍", label: "Liveness check" },
      { icon: "🔒", label: "100% seguro" }
    ].map(({ icon, label }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      background: "#f9fafb",
      borderRadius: 10,
      padding: "10px 8px",
      fontSize: 12,
      color: "#374151"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 22, marginBottom: 4 }, children: icon }),
      label
    ] }, label)) }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      background: "#fef2f2",
      border: "1px solid #f87171",
      borderRadius: 8,
      padding: "10px 14px",
      marginBottom: 16,
      fontSize: 13,
      color: "#b91c1c",
      textAlign: "left"
    }, children: [
      "⚠️ ",
      error
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: startVerification,
        disabled: state === "loading",
        style: {
          width: "100%",
          padding: "14px 24px",
          background: state === "loading" ? "#9ca3af" : "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: 10,
          fontWeight: 700,
          fontSize: 16,
          cursor: state === "loading" ? "not-allowed" : "pointer",
          transition: "background 0.2s"
        },
        children: state === "loading" ? "⏳ Iniciando..." : "🚀 Comenzar verificación"
      }
    )
  ] });
}

export { IneVerification as default, jsxRuntimeExports as j };
