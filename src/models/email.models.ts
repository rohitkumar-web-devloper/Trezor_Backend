import mongoose, { Schema } from "mongoose";


const EmailSchema = new Schema<any>(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["admin", "user"], default: "admin" }
    },
    { timestamps: true }
);
const EmailModel = mongoose.model<any>("Email", EmailSchema);

;
