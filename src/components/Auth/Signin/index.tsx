"use client";
import Link from "next/link";
import React from "react";
import GoogleSigninButton from "../GoogleSigninButton";
import SigninWithPassword from "../SigninWithPassword";

export default function Login() {
  return (
    <>
      <div>
        <SigninWithPassword />
      </div>
    </>
  );
}
