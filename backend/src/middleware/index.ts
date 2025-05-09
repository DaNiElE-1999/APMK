import express from "express";
import { mongoMiddleware }   from "./database";

export default [
  express.json(),
  mongoMiddleware,
];