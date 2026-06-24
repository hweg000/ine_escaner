# INE Verifier 🪪

Proyecto de prueba para verificar credenciales INE mexicanas usando la API de [Didit](https://didit.me).

## Arquitectura (Microfrontend)

```
ine-verifier/
├── backend/        → Node.js + Express  (puerto 4000)
│                     Proxy hacia Didit API
├── ine-widget/     → React + Vite       (puerto 3001)
│                     Microfrontend expuesto via Module Federation
└── shell/          → React + Vite       (puerto 3000)
                      App contenedor que consume el widget
```

## Configuración inicial

### 1. Obtén tu API key de Didit
1. Crea una cuenta en [business.didit.me](https://business.didit.me) (gratis, 500 verificaciones/mes)
2. Ve a **API & Webhooks** y copia tu API Key

### 2. Configura el backend
```bash
cd backend
cp .env.example .env
# Edita .env y pega tu DIDIT_API_KEY
npm install
```

### 3. Instala dependencias del frontend
```bash
cd ../ine-widget
npm install

cd ../shell
npm install
```

## Cómo correr el proyecto

Necesitas **3 terminales** abiertas:

### Terminal 1 — Backend
```bash
cd backend
npm run dev
# → http://localhost:4000
```

### Terminal 2 — Widget (microfrontend)
```bash
cd ine-widget
npm run build   # compila el widget (module federation requiere build)
npm run preview # sirve el remoteEntry.js en :3001
# → http://localhost:3001
```

### Terminal 3 — Shell (app principal)
```bash
cd shell
npm run dev
# → http://localhost:3000  ← Abre esto en el navegador
```

> **Nota:** Cada vez que modifiques el widget, corre `npm run build` en `ine-widget` y recarga el shell.

## Flujo de verificación

1. El usuario sube foto del **frente** de su INE (obligatorio)
2. Opcionalmente sube el **reverso**
3. El frontend envía las imágenes al backend (`POST /api/verify-ine`)
4. El backend las reenvía a Didit (`POST /v3/id-verification/`)
5. Se muestra el resultado: **✅ VÁLIDA** o **❌ INVÁLIDA**
6. Se muestran los datos extraídos: nombre, CURP, vigencia, etc.

## Notas importantes sobre las fotos de INE

- Las **4 esquinas** del documento deben ser visibles (no recortar)
- Tamaño recomendado: entre **250 KB y 1 MB**
- Formatos aceptados: `jpg`, `jpeg`, `png`, `webp`
- Buena iluminación, sin reflejos ni sombras

## Plan gratuito de Didit

- **500 verificaciones/mes** sin costo
- Sin tarjeta de crédito requerida
- El contador se reinicia el 1 de cada mes
