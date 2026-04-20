// src/modules/auth/token.model.ts

import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    token: {
      type: String, // hashed token
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Token || mongoose.model("Token", TokenSchema);