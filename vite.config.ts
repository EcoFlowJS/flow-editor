import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import jotaiDebugLabel from "jotai/babel/plugin-debug-label";
import jotaiReactRefresh from "jotai/babel/plugin-react-refresh";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({ babel: { plugins: [jotaiDebugLabel, jotaiReactRefresh] } }),
  ],
  base: "/editor/flow",
  server: {
    port: 3002,
    proxy: {
      "/admin": {
        target: "http://localhost:3001/",
        changeOrigin: true,
      },
      "/auth": {
        target: "http://localhost:3000/",
        changeOrigin: true,
      },
      "/editor/schema": {
        target: "http://localhost:3003/",
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id: string) => {
          if (id.includes("react-icons/ai")) return "react-icons/ai";
          if (id.includes("react-icons/bs")) return "react-icons/bs";
          if (id.includes("react-icons/bi")) return "react-icons/bi";
          if (id.includes("react-icons/ci")) return "react-icons/ci";
          if (id.includes("react-icons/cg")) return "react-icons/cg";
          if (id.includes("react-icons/di")) return "react-icons/di";
          if (id.includes("react-icons/fi")) return "react-icons/fi";
          if (id.includes("react-icons/fc")) return "react-icons/fc";
          if (id.includes("react-icons/fa")) return "react-icons/fa";
          if (id.includes("react-icons/fa6")) return "react-icons/fa6";
          if (id.includes("react-icons/gi")) return "react-icons/gi";
          if (id.includes("react-icons/go")) return "react-icons/go";
          if (id.includes("react-icons/gr")) return "react-icons/gr";
          if (id.includes("react-icons/hi")) return "react-icons/hi";
          if (id.includes("react-icons/hi2")) return "react-icons/hi2";
          if (id.includes("react-icons/im")) return "react-icons/im";
          if (id.includes("react-icons/lia")) return "react-icons/lia";
          if (id.includes("react-icons/io")) return "react-icons/io";
          if (id.includes("react-icons/io5")) return "react-icons/io5";
          if (id.includes("react-icons/lu")) return "react-icons/lu";
          if (id.includes("react-icons/md")) return "react-icons/md";
          if (id.includes("react-icons/pi")) return "react-icons/pi";
          if (id.includes("react-icons/rx")) return "react-icons/rx";
          if (id.includes("react-icons/ri")) return "react-icons/ri";
          if (id.includes("react-icons/si")) return "react-icons/si";
          if (id.includes("react-icons/sl")) return "react-icons/sl";
          if (id.includes("react-icons/tb")) return "react-icons/tb";
          if (id.includes("react-icons/tfi")) return "react-icons/tfi";
          if (id.includes("react-icons/ti")) return "react-icons/ti";
          if (id.includes("react-icons/vsc")) return "react-icons/vsc";
          if (id.includes("react-icons/wi")) return "react-icons/wi";
          if (id.includes("react-icons")) return "react-icons";
          if (id.includes("@reactflow")) return "reactflow";
          if (id.includes("socket.io")) return "socket.io";
          if (id.includes("rsuite")) return "rsuite";
          if (id.includes("lodash")) return "lodash";
          if (id.includes("axios")) return "axios";
          if (id.includes("d3")) return "d3";
        },
      },
    },
  },
});
