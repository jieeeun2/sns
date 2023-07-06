import Post from "../models/Post.js"
import User from "../models/User.js"

/* create */
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body
    const user = await User.findById(userId)
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      commnets: []
    })
    await newPost.save()

    const post = await User.find()
    res.status(201).json(post)
  } catch (err) {
    res.status(409).send({ message: err.message })
  }
}

/* read */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find()
    res.status(200).json(post)
  } catch (err) {
    res.status(404).send({ message: err.message })
  }
}

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params
    const posts = await Post.find({ userId })
    res.status(200).json(posts)
  } catch (err) {
    res.status(404).send({ message: err.message })
  }
}

/* update */
export const likePost = async (req, res) => { //이부분 어려워ㅠㅠ
  try {
    const { id } = req.params
    const { userId } = req.body
    const post = await Post.findById(id)
    const isLiked = post.likes.get(userId) 

    if (isLiked) { 
      post.likes.delete(userId)
    } else {
      post.likes.set(userId, true) 
    }

    const updatePost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    )

    res.status(200).json()
  } catch (err) {
    res.status(404).send({ message: err.message })
  }
}