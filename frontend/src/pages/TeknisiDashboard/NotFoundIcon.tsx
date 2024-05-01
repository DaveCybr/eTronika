import React, { useEffect } from "react";

const DotLottiePlayer = () => {
  useEffect(() => {
    // Load the script dynamically
    const script = document.createElement("script");
    script.src =
      "https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs";
    script.type = "module";
    document.body.appendChild(script);

    // Cleanup
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <dotlottie-player
      src="https://lottie.host/2b99aea0-cf51-4ba8-9645-4c9740a497b7/r4g7LzEQLJ.json"
      background="transparent"
      speed="1"
      style={{ width: "300px", height: "300px" }}
      loop
      autoplay
    ></dotlottie-player>
  );
};

export default DotLottiePlayer;
