// import React, { MouseEvent } from "../imports/react.ts";
import React, { MouseEvent } from "react";
import styled from "styled-components";

export function Picture({
  src,
  alt,
  xwave = 1e-6,
  ywave = 1e-6,
}: {
  src: string;
  alt?: string;
  xwave?: number;
  ywave?: number;
}) {
  function handleHover(e: MouseEvent<HTMLImageElement>) {
    let rect = e.target.getBoundingClientRect();
    let dx = (e.clientX - rect.x - rect.width / 2) * xwave;
    let dy = (e.clientY - rect.y - rect.height / 2) * ywave;
    e.target.style.setProperty("--proj-x", dx);
    e.target.style.setProperty("--proj-y", dy);
    e.target.style.border = "5px solid #f0306f";
  }
  function handleLeave(e: MouseEvent<HTMLImageElement>) {
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
  flex: 0 0 55%;
  display: grid;
  margin: 0.5em;
  width: 100%;

  & img {
    --proj-x: 0;
    --proj-y: 0;
    max-width: 100%;
    box-sizing: border-box;
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

    /* Cool infinite background scrolling animation.
    * Twitter: @kootoopas
    */

    /* Background data (Original source: gridme.png) */
    --gridme-url-white-bg: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAIAAACRXR/mAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAABnSURBVHja7M5RDYAwDEXRDgmvEocnlrQS2SwUFST9uEfBGWs9c97nbGtDcquqiKhOImLs/UpuzVzWEi1atGjRokWLFi1atGjRokWLFi1atGjRokWLFi1af7Ukz8xWp8z8AAAA//8DAJ4LoEAAlL1nAAAAAElFTkSuQmCC");
    --gridme-url-no-bg: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAdElEQVRoge3awQ2AMBDEwPRfQJCuQUBABfdYftTgII+0Bfi/Y24z3Z3j3Jddd2ckSVVlLKyqMu7nWjriYwiNITSG0BhCYwiNITSG0BhCYwiNITSG0BhCYwiNITSG0BhCYwiNITSG0BhCYwiNITSG0Pzlr/UCuDB9RB/5Lj8AAAAASUVORK5CYII=");
    --bg-width: 50px;
    --bg-height: 50px;

    /* Animations */
    @keyframes bg-scrolling-reverse {
      100% {
        background-position: var(--bg-width) var(--bg-height);
      }
    }
    @keyframes bg-scrolling {
      0% {
        background-position: var(--bg-width) var(--bg-height);
      }
    }
    background: var(--gridme-url-no-bg) repeat 0 0;

    animation: bg-scrolling-reverse 3s infinite;
    animation-timing-function: linear;
  }
`;
// alternative background animation: glowing linear-gradient
// background: linear-gradient(
// -45deg,
// rgba(253, 165, 194, 0.17),
// rgb(255, 181, 206),
// rgb(192, 215, 253),
// rgba(178, 206, 251, 0.22)
// );
// background-size: 400% 400%;
// animation: gradient 15s ease infinite;

// @keyframes gradient {
// 0% {
// background-position: 0% 50%;
// }
// 50% {
// background-position: 100% 50%;
// }
// 100% {
// background-position: 0% 50%;
// }
// }
// }
