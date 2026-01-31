const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    uid: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["buyer", "manager", "admin"], default: "buyer" },
    status: { type: String, enum: ["approved", "suspended", "pending"], default: "pending" },
    photoURL: { type: String },

    // ✅ ADD THESE 2 LINES
    suspendReason: { type: String, default: "" },
    suspendFeedback: { type: String, default: "" }

    

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
