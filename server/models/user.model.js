import mongoose, { Types } from "mongoose";

const userschema = mongoose.Schema(
  {
    name: {
      Type: String,
      required: true
    },
    email: {
      Type: String,
      required: true
    },
    password: {
      Type: String,
      required: true
    },
    role: {
      Type: String,
      enum: ["user", "admin"],
      default: "user"
    },
    isVerified: {
      Type: Boolean,
      default: false
    },
    verificationToken: {
      type: String
    },
    resetPasswordToken: {
      type: String
    },
    resetPasswordExpires: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

userschema.pre("save", async function (next) {
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10);
    }
})

const User = mongoose.Model("User", userschema);

export default User;
