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
    <div style={styles.wrapper}>
      <h1 style={styles.title}>📍 Tracking Results</h1>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Device</th>
              <th style={styles.th}>IP</th>
              <th style={styles.th}>GPS</th>
              <th style={styles.th}>Time</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item: any, index: number) => (
              <tr
                key={item.id}
                style={
                  index % 2 === 0 ? styles.rowEven : styles.rowOdd
                }
              >
                <td style={styles.td}>{item.id}</td>
                <td style={styles.td}>{item.device}</td>
                <td style={styles.td}>{item.ip}</td>

                <td style={styles.td}>
                  {item.gpsLat && item.gpsLon ? (
                    <a
                      href={`https://www.google.com/maps?q=${item.gpsLat},${item.gpsLon}`}
                      target="_blank"
                      style={styles.mapButton}
                    >
                      Lihat Maps
                    </a>
                  ) : (
                    <span style={styles.noGps}>No GPS</span>
                  )}
                </td>

                <td style={styles.td}>
                  {new Date(item.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles: Record<string, any> = {
  wrapper: {
    padding: 20,
    maxWidth: 900,
    margin: "0 auto",
  },
  title: {
    fontSize: 28,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 20,
  },
  tableContainer: {
    overflowX: "auto",
    borderRadius: 10,
    border: "1px solid #ddd",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 15,
  },
  th: {
    padding: "12px 10px",
    background: "#f3f4f6",
    textAlign: "left",
    fontWeight: "bold",
    borderBottom: "1px solid #ddd",
  },
  td: {
    padding: "10px",
    borderBottom: "1px solid #eee",
  },
  rowEven: {
    background: "#fff",
  },
  rowOdd: {
    background: "#fafafa",
  },
  mapButton: {
    background: "#2563eb",
    color: "white",
    padding: "6px 12px",
    borderRadius: 6,
    textDecoration: "none",
    fontSize: 13,
  },
  noGps: {
    color: "#999",
    fontStyle: "italic",
  },
};
