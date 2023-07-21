import mongoose from "mongoose"

const subSchema = mongoose.Schema({
  commentWriterId: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  isDelete: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const postSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    location: String,
    description: String,
    picturePath: String,
    userPicturePath: String,
    views: {
      type: Number
    },
    likes: {
      type: Map,
      of: Boolean,
      required: true,
      default: false
    },
    comments: {
      type: [subSchema],
      default: []
    }
  },
  { timestamps: true }
)

const Post = mongoose.model('Post', postSchema)

export default Post