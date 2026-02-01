import React, { useState, useEffect } from "react";

export default function EnlargedInput() {
  const [text, setText] = useState("1.123456");
  const [cursorPos, setCursorPos] = useState(0);
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);

  const containerStyle = {
    position: "relative",
    fontFamily: "monospace",
    fontSize: "24px",
    width: "300px"
  };

  const overlayStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    paddingBottom: "8px",
    pointerEvents: "none",
    whiteSpace: "pre",
    display: "inline-flex",
    alignItems: "center",
    height: "60px",
    zIndex: 2,
    color: "red",

  };

  const inputStyle = {
    position: "relative",
    zIndex: 1,
    width: "100%",
    padding: "8px",
    fontSize: "24px",
    fontFamily: "monospace",
    color: "transparent",
    caretColor: "transparent",
    border: "1px solid #ccc",
    borderRadius: "4px",
    outline: "none",
    background: "transparent"
  };

  const decimalIndex = text.indexOf(".");

  useEffect(() => {
    if (decimalIndex !== -1) {
      // 3rd and 4th digits are at positions decimalIndex + 3 and decimalIndex + 4
      setSelectionStart(decimalIndex + 3);
      setSelectionEnd(decimalIndex + 5);
    }
  }, [decimalIndex]);

  return (
    <div style={containerStyle}>
      {/* Overlay */}
      <div style={overlayStyle}>
        {text.split("").map((char, i) => {
          let isEnlarged = false;

          if (decimalIndex !== -1 && i > decimalIndex) {
            const digitAfterDecimal = i - decimalIndex;
            isEnlarged = digitAfterDecimal === 3 || digitAfterDecimal === 4;
          }

          const isSelected = i >= selectionStart && i < selectionEnd;

          return (
            <React.Fragment key={i}>
              <span
                style={{
                  fontSize: isEnlarged ? "1.6em" : "1em",
                  fontWeight: isEnlarged ? "bold" : "normal",
                  color: isSelected ? "white" : (isEnlarged ? "red" : "orange"),
                  backgroundColor: isSelected ? "blue" : "transparent",
                  lineHeight: "1",
                  display: "inline-block",
                  height: "1.3em",
                }}
              >
                {char}
              </span>

              {cursorPos === i + 1 && <Caret />}
            </React.Fragment>
          );
        })}

        {cursorPos === 0 && <Caret />}
      </div>

      {/* Hidden input */}
      <input
        type="text"
        value={text}
        onChange={(e) => {
          const filteredValue = e.target.value.replace(/[^0-9.]/g, "");
          setText(filteredValue);
          setCursorPos(e.target.selectionStart);
          setSelectionStart(e.target.selectionStart);
          setSelectionEnd(e.target.selectionEnd);
        }}
        onClick={(e) => {
          setCursorPos(e.target.selectionStart);
          setSelectionStart(e.target.selectionStart);
          setSelectionEnd(e.target.selectionEnd);
        }}
        onKeyUp={(e) => {
          setCursorPos(e.target.selectionStart);
          setSelectionStart(e.target.selectionStart);
          setSelectionEnd(e.target.selectionEnd);
        }}
        style={inputStyle}
      />

      <style>
        {`
          @keyframes blink {
            50% { opacity: 0; }
          }
          input::selection {
            background-color: transparent;
            color: transparent;
          }
        `}
      </style>
    </div>
  );
}

function Caret() {
  return (
    <span
      style={{
        width: "2px",
        background: "green",
        marginLeft: "1px",
        animation: "blink 1s steps(1) infinite",
        display: "inline-block",
        height: "1.3em"
      }}
    />
  );
}
