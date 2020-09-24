const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// We can't use arrow functions here so we can use the 'this' keyword
userSchema.pre("save", async function (next) {
  try {
    console.log("Hashing the user password before saving to DB");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);

    this.password = hashedPassword;
    next();
  } catch (err) {
    next(err);
  }
});

// We can't use arrow functions here so we can use the 'this' keyword
// userSchema.post('save', async function(next) {
//   try{
//     console.log('Hashing the user password before saving to DB');
//     const salt = await bcrypt.genSalt()

//   } catch(err) {
//     next(err)
//   }

//   next()
// })

// Always create the name of the collection in SINGULAR
const User = model("user", userSchema);

module.exports = User;
