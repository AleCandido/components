import React from "react";
import styled from "styled-components";

export const Header = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export const NavBar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 80%;
  margin-top: 1em;
`;

export const Title = styled.h1`
  margin: 0.5em 0 0.6em 0;
  font-size: 3rem;
  font-family: "Indie Flower", cursive;

  & em {
    font-size: 0.9em;
    font-style: italic;
  }
`;
