import React from "react";
import LoadingIcon from "../LoadingIcon";

const loadingIndicatorOverlay: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(237, 233, 232, 0.8)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999,
};

const loadingIndicator: React.CSSProperties = {
  padding: 20,
  borderRadius: 8,
  height: 100,
  textAlign: "center",
};

export default function Loading() {
  return (
    <div className="loading-indicator-overlay" style={loadingIndicatorOverlay}>
      <div className="loading-indicator-content" style={loadingIndicator}>
        <LoadingIcon icon="bars" className="w-12 h-12" />
        <div className="mt-5 text-lg text-center font-medium">
          Please Wait...
        </div>
      </div>
    </div>
  );
}
