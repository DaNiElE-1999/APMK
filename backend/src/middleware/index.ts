import express from "express";
import { authz } from "./authz";

export default [
  express.json(),
  authz,
];