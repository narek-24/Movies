"use client";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html style={{ colorScheme: "dark" }}>
      <body
        style={{
          textAlign: "center",
          paddingTop: "100px",
          fontFamily: "sans-serif",
        }}
      >
        <h2
          style={{
            fontSize: "3rem",
            marginBottom: "2.5rem",
            fontWeight: "bold",
          }}
        >
          Something went wrong!
        </h2>
        <button
          style={{
            cursor: "pointer",
            borderRadius: "999px",
            backgroundColor: "white",
            paddingInline: "2rem",
            paddingBlock: "0.75rem",
            fontSize: "1rem",
            fontWeight: "600",
            color: "black",
            border: "none",
          }}
          onClick={() => reset()}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
