import { useState, useEffect } from "react";
import api from "../api.jsx";
import { useNavigate } from "react-router-dom";
import { SignupForm } from "@/components/signup-form";

function SignUp() {
  return (
    <>
      <SignupForm />
    </>
  );
}

export { SignUp };
