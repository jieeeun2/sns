import Post from "../models/Post.js";
import User from "../models/User.js";

/* create -createPost */

/* 새로운 Post 생성 
  req.body에 userId, description, picturePath
*/
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

    const post = await Post.find();
    res.status(201).json(post);
  } catch (err) {
    res.status(409).send({ message: err.message });
  }
};

/* read */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find();
    console.log(post)
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
    // console.log(req.params)
    // console.log(req.body)
    const { postId, commentId } = req.params
    const userId = req.body.userId

    const post = await Post.findById(postId)

    /* 로그인한 유저 본인꺼만 지울수 있도록 프론트에서도 처리해주었지만 
    혹시나 프론트가 잘못보여질경우가 있을수 있으니깐 
    백엔드에서는 로그인한 유저 본인이 쓴 댓글 이외의 것을 삭제할수 없도록 처리해줌 */
    post.comments = post?.comments?.filter(comment => { 
      if(comment.commentWriterId !== userId) return comment
      return comment.id !== commentId 
    })

    const updatedPost = await post.save()
    res.status(200).json(updatedPost)
  } catch (err) {
    res.status(404).send({ message: err.message });
  }
}
