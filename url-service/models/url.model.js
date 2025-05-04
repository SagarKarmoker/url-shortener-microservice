import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
    urlCode: {
        type: String,
        required: true,
        unique: true,
    },
    longUrl: {
        type: String,
        required: true,
    },
    shortUrl: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    createdBy: {
        type: String,
        required: true,
    },
    clicks: {
        type: Number,
        default: 0,
    }
}, {
    timestamps: true,
});

const Url = mongoose.model("Url", urlSchema);
export default Url;