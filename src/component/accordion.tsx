import { ReactNode, useState } from "react";

export const Accordion = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid #e9e9e9",
          borderBottom: "1px solid #e9e9e9",
        }}
      >
        <h2>{title}</h2>
        <button
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          style={{
            width: "2rem",
            height: "2rem",
            backgroundColor: "#fff",
            cursor: "pointer",
          }}
        >
          {isOpen ? "▲" : "▼"}
        </button>
      </div>

      {isOpen && children}
    </>
  );
};
