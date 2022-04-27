import React from "react";

interface IProps {
  spin?: boolean;
  pulse?: boolean;
}

export const HelloWorld: React.FC<IProps> = ({ spin, pulse }) => (
  <div className="absolute inset-0 flex items-center justify-center font-display">
    <p
      className={`
        text-6xl text-white
        ${spin ? "animate-spin" : ""}
        ${pulse ? "animate-pulse" : ""}
      `}
    >
      {`Hello World`}
    </p>
  </div>
);

export default HelloWorld;
