import mongoose from "mongoose";

const my_schema = mongoose.Schema({
    email : String,
    password : String
})

export const my_Credential_Schema = mongoose.models.mycrediantals || mongoose.model("mycrediantals",my_schema)