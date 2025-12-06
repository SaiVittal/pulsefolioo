import { useEffect, useState } from "react";

export default function useBreakpoint() {
  const [bp, setBp] = useState("desktop");

  useEffect(() => {
    const resize = () => {
      if (window.innerWidth < 768) setBp("mobile");
      else if (window.innerWidth < 1280) setBp("tablet");
      else setBp("desktop");
    };

    resize();
    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);
  }, []);

  return bp;
}
