"use client";

import { useEffect, useState } from "react";

export default function TrackPage() {
  const [status, setStatus] = useState("Loading...");

  useEffect(() => {
    async function run() {
      try {
        setStatus("Detecting IP & Device...");

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

        setStatus("IP saved. Requesting GPS permission...");

        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            async (pos) => {
              setStatus("GPS granted. Saving coordinates...");

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

              setStatus("GPS saved successfully.");
            },
            () => {
              setStatus("GPS denied by user.");
            }
          );
        } else {
          setStatus("GPS is not supported.");
        }
      } catch (err) {
        console.error(err);
        setStatus("Error: " + String(err));
      }
    }

    run();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Tracking...</h1>
      <p>{status}</p>
    </div>
  );
}

function getDeviceInfo() {
  const ua =
    typeof navigator !== "undefined" ? navigator.userAgent : "unknown";

  let device = "Unknown Device";

  if (/iPhone/i.test(ua)) device = "iPhone";
  else if (/iPad/i.test(ua)) device = "iPad";
  else if (/Samsung|SM-/i.test(ua)) device = "Samsung";
  else if (/Xiaomi|Mi/i.test(ua)) device = "Xiaomi";
  else if (/OPPO/i.test(ua)) device = "OPPO";
  else if (/Vivo/i.test(ua)) device = "Vivo";
  else if (/Realme/i.test(ua)) device = "Realme";
  else if (/Android/i.test(ua)) device = "Android Phone";

  return { device, ua };
}
