import mongoose from "mongoose";

const appSchema = new mongoose.Schema(
  {
    app_name: {
      type: String,
      required: true,
    },
    app_version: {
      type: String,
    },
    prev_app_version: {
      type: String,
    },
    app_url: {
      type: String,
    },
    timestamp: [{ timestamp: { type: Number } }],
  },
  { timestamps: true }
);

const AppModel = mongoose.model("musicApp", appSchema);
export default AppModel;
