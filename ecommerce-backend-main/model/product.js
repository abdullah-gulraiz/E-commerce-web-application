const{Schema,model}=require("mongoose");

const productSchema=new Schema({
  title:{
    type:String,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  price:{
    type:Number,
    required:true
  },
  category:{
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required:true
  },
  image:[{
    type:String,
  }
],
  reviews:[{
    user:{
      type:Schema.Types.ObjectId,
      ref: 'User'
    },
    comment:{
      type:String,
      required:true
    },
    rating:{
      type:Number,
      min:1,
      max:5
    }
  }]
});
module.exports = model('Product', productSchema);