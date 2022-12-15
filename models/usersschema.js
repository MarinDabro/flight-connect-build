import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['user', 'manager'], default: 'user' },
  token: { type: String },
  password: { type: String, required: true },
  flights: [{ type: Schema.Types.ObjectId, ref: 'flights'}],
  orders: [{ type: Schema.Types.ObjectId, ref: 'orders'}],
  profileImage: {
    type: String,
    default: function () {
      return `https://joeschmoe.io/api/v1/${this.firstName}`;
    },
  
  },
     
});


 userSchema.set('toJSON', {
    virtuals: true,
});

userSchema.set('toObject', {
    virtuals: true,
});
 
/* userSchema.virtual('id').get(function () {
  return this._id.toHexString();
}); */

  userSchema.virtual('fullName').get(function () {
  return this.firstName + ' ' + this.lastName;
});  

userSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    const hashedPassword = bcrypt.hashSync(this.password, 10);
    this.password = hashedPassword;
  }
  next();
});

const UserCollection = mongoose.model('user', userSchema);

UserCollection.createIndexes({ email: -1 });

export default UserCollection;
