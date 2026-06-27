"use client";
import { useJwt } from "@/lib/hooks/useJwt";

export default function JwtProvider({ children }) {
  useJwt();
  return children;
}
