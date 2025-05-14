"use client";
import React, { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/actions/auth.actions";

const Authlayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     const isUserAuthenticated = await isAuthenticated();
  //     if (isUserAuthenticated) {
  //       router.push("/"); // Redirect to the home page
  //     }
  //   };

  //   checkAuth();
  // }, [router]);

  return <div className="auth-layout">{children}</div>;
};

export default Authlayout;