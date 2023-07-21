import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined
} from "@mui/icons-material";
import BackspaceOutlinedIcon from '@mui/icons-material/BackspaceOutlined';
import { Box, Button, Divider, IconButton, TextField, Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";

const PostWidget = ({
  postId,
  postUserId,
  name,
  location,
  description,
  picturePath,
  userPicturePath,
  likes,
  comments,
}) => {
  console.log(postId, postUserId, name, location, description, picturePath, userPicturePath, likes, comments)
  const [comment, setComment] = useState('')
  const [isComments, setIsComments] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const patchLike = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const patchComments = async () => {
    console.log("commnet", comment)
    const response = await fetch(`http://localhost:3001/posts/${postId}/comments`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        userId: loggedInUserId,
        comment: comment
      })
    })
    const updatedPost = await response.json()
    dispatch(setPost({ post: updatedPost }));
    setComment('')
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value)
  }

  const deleteComments = async (commentId) => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/${commentId}/deleteComments`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        userId: loggedInUserId,
      })
    })
    const updatedPost = await response.json()
    //console.log(updatedPost)
    dispatch(setPost({ post: updatedPost }));
  }

  return (
    <WidgetWrapper mb="2rem">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:3001/assets/${picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => { setIsComments(!isComments) }}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>

      {isComments && (
        <Box mt="0.5rem">
          <Box display="flex" justifyContent="center" alignItems="center">
            <TextField
              label="Comment"
              onChange={handleCommentChange}
              value={comment}
              name="comment"
              sx={{ width: "100%"}}
            />
            <Button 
              onClick={patchComments}
              sx={{
                ml: "0.3rem",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main }
              }}
            >
              register
            </Button>
          </Box>
          <Box>
            {comments.slice(0).reverse().map((comment, i) => (
              <>
              {comment.isDelete === false &&
                <Box key={`${postId}-${i}`}>
                  <FlexBetween>
                    <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                      {comment.text}
                    </Typography>
                    {comment.commentWriterId === loggedInUserId &&
                      <IconButton onClick={() => deleteComments(comment._id)}>
                        <BackspaceOutlinedIcon sx={{ color: main }}/>
                      </IconButton>
                    } 
                  </FlexBetween>
                  <Divider />
                </Box>
              }
              </>
            ))}
          </Box>
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
