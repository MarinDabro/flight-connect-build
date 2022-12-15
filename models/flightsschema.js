import mongoose from "mongoose";

const Schema = mongoose.Schema;

const flightSchema = new Schema({
   flight: {type: String, required:true},
     userId: { type:Schema.Types.ObjectId, ref:"users", required:true}  
  
});

const FlightsCollection = mongoose.model("flights", flightSchema);

export default FlightsCollection;
