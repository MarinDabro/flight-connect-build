

import mongoose from "mongoose";

const Schema = mongoose.Schema ;

// order docuemnt structure
const bookingSchema = new Schema({
    //records ids are not a normal string they are Object ids belonging to records collection
    flights: [ { type:Schema.Types.ObjectId, ref:"flights" ,required:true} ],
    totalPrice: { type:Number, required:true},
    //userId is not a normal string it is Object id belonging to users collection
    userId: { type:Schema.Types.ObjectId, ref:"users", required:true}
})

const BookingCollection = mongoose.model("booking", bookingSchema)

export default BookingCollection;