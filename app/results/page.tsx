/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";

export default function ResultsPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("/api/get-data")
      .then(res => res.json())
      .then(setItems);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Tracking Results</h1>

      <table border={1} cellPadding={8} style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Device</th>
            <th>IP</th>
            <th>GPS</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item: any) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.device}</td>
              <td>{item.ip}</td>
              <td>
                {item.gpsLat && item.gpsLon ? (
                  <a
                    href={`https://www.google.com/maps?q=${item.gpsLat},${item.gpsLon}`}
                    target="_blank"
                    style={{ color: "blue", textDecoration: "underline" }}
                  >
                    Lihat Maps
                  </a>
                ) : (
                  "No GPS"
                )}
              </td>
              <td>{new Date(item.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
