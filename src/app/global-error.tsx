"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  void error;
  return (
    <html lang="id">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#F7F3EC",
          color: "#2B2622",
          fontFamily: "Georgia, serif",
          padding: 24,
        }}
      >
        <main style={{ maxWidth: 520, textAlign: "center" }}>
          <p style={{ fontSize: 120, margin: 0, color: "#8C4A32", lineHeight: 1 }}>404</p>
          <h1 style={{ fontSize: 32, marginTop: 16 }}>Ada yang tidak beres.</h1>
          <p style={{ color: "#6B6158", fontFamily: "system-ui, sans-serif", lineHeight: 1.6 }}>
            Halaman ini gagal dimuat. Coba lagi, atau kembali ke beranda.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 24,
              border: 0,
              background: "#8C4A32",
              color: "#FFFDF8",
              padding: "14px 22px",
              borderRadius: 4,
              fontFamily: "system-ui, sans-serif",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Coba lagi
          </button>
        </main>
      </body>
    </html>
  );
}
