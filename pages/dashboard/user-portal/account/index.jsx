import Link from "next/link";
import React, { useContext, useState } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "@/context/AuthContext";

const index = () => {
  const { user } = useContext(AuthContext);
  return (
    <>
      <div>
        <h1>Account Page</h1>
      </div>
    </>
  );
};

export default index;
