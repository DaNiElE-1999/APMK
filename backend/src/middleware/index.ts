import express from "express";
import { authz } from "./authz";
import { corsAllWithCreds } from "./cors";

export default [
  express.json(),
  authz,
  corsAllWithCreds
];