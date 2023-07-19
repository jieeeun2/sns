import Post from "../models/Post.js";
import User from "../models/User.js";

/* create */
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      commnets: {},
    });
    await newPost.save();

    const post = await User.find();
    res.status(201).json(post);
  } catch (err) {
    res.status(409).send({ message: err.message });
  }
};

/* read */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find();
    //console.log(post)
    res.status(200).json(post);
  } catch (err) {
    res.status(404).send({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    //console.log(req.params)
    const { userId } = req.params;
    const posts = await Post.find({ userId });
    //console.log(posts)
    res.status(200).json(posts);
  } catch (err) {
    res.status(404).send({ message: err.message });
  }
};

/* update */
export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(postId);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).send({ message: err.message });
  }
};


export const comments = async (req, res) => {
  try {
    // console.log(req.params)
    // console.log(req.body)
    const { postId } = req.params
    const { userId, comment } = req.body

    const post = await Post.findById(postId)
    post.comments.push({ commentWriterId: userId, text: comment, isDelete: false })

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { comments: post.comments },
      { new: true }
    )
    
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).send({ message: err.message });
  }
};



/* delete */
export const deleteComments = async (req, res) => {
  try {
    console.log(req.body.userId)
    // console.log(req.params)
    // console.log(req.body)
    const { postId, commentId } = req.params
    //로그인 된 유저꺼 본인꺼만 지울수있게 뭔가 해줘야하는디
    const userId = req.body.userId

    const post = await Post.findById(postId)
    post.comments = post?.comments?.filter((comment) => {
      console.log(comment.commentWriterId, userId)
      if(comment.commentWriterId !== userId) return

      return comment.id !== commentId
    })
    console.log('post임', post)
  
    const updatedPost = await post.save()
    console.log('updatedPost임', updatedPost)
    
    res.status(200).json(updatedPost)
  } catch (err) {
    res.status(404).send({ message: err.message });
  }
}
