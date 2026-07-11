import mongoose from "mongoose";

const cmsSettingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true }
);

const CmsSetting = mongoose.model("CmsSetting", cmsSettingSchema);
export default CmsSetting;
