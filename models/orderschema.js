import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    orders: [{type: String, required: true }], 
     totalPrice: {type: String , required: true}, 
    userId: { type:Schema.Types.ObjectId, ref:"users", required:true} 

})

    const OrderCollection = mongoose.model('orders', orderSchema);

    export default OrderCollection;