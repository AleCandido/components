import React from "../imports/react.ts";
import styled from "../imports/styled-components.ts";

export function Picture({ src, alt }: { src?: string; alt?: string }) {
  function handleHover(e) {
    let rect = e.target.getBoundingClientRect();
    let dx = (e.clientX - rect.x - rect.width / 2) * 2e-6;
    let dy = (e.clientY - rect.y - rect.height / 2) * 2e-6;
    e.target.style.setProperty("--proj-x", dx);
    e.target.style.setProperty("--proj-y", dy);
    e.target.style.border = "5px solid #f0306f";
  }
  function handleLeave(e) {
    e.target.style.setProperty("--proj-x", 0);
    e.target.style.setProperty("--proj-y", 0);
    e.target.style.border = "4px solid #393939";
  }
  return (
    <img
      src={src}
      alt={alt}
      onMouseMove={handleHover}
      onMouseLeave={handleLeave}
    />
  );
}

export const PictureFrame = styled.div`
  & img {
    --proj-x: 0;
    --proj-y: 0;
    width: 50vw;
    border: 4px solid #393939;
    border-radius: 5px;
    transform: matrix3d(
      1,
      0,
      0,
      var(--proj-x),
      0,
      1,
      0,
      var(--proj-y),
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    );
    transition: transform 0.1s;
  }
`;
