import { Album, Box } from "lucide-react";
import { useState } from "react";

import openNewFileSection from "@/lib/overleaf/openNewFileSection";
import { cn } from "@/lib/utils";

const NewFileSidebarButton = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <button
      type="button"
      className={cn(
        "text-left font-sans",
        "border-transparent",
        "shadow-none",
        "rounded-none",
        "cursor-pointer",
        isActive ? "bg-white" : "bg-transparent hover:bg-white",
        "w-full",
        "flex items-center justify-left gap-2",
        "mt-2 py-2",
      )}
      style={{
        color: "#495365",
        padding: "6.25px",
        fontSize: "16px",
        justifyContent: "left",
      }}
      onClick={() => {
        setIsActive(true);

        openNewFileSection(() => setIsActive(false));
      }}
    >
      <Album size={20} />
      From Better Bibtex
    </button>
  );
};

export default NewFileSidebarButton;
