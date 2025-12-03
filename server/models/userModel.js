import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
      // select: false, // optionally hide in queries unless explicitly requested
    },
  },
  {
    timestamps: true,
  }
);

userSchema.set("toJSON", {
  transform(doc, ret) {
    delete ret.passwordHash;
    return ret;
  },
});

const User = mongoose.model("User", userSchema);

export default User;
