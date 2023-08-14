import User from "../models/User.js";

/* read - getUser, getUserFriends, getUsers */

/* 해당 사용자 정보 내보내기
  req.params에 id
*/
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* 사용자 친구 정보 내보내기
  req.params에 id
*/
export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    //*****비동기를 병렬처리 
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    //console.log("formattedFriends: ", formattedFriends)
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* 해당 사용자 목록 내보내기
  req.body에 searchText
*/
export const getUsers = async (req, res) => {
  // console.log(req.body)
  const searchText = req.body.searchText;

  try {
    const users = await User.find({
      $or: [
        { firstName: new RegExp(`${searchText}`, "i") },
        { lastName: new RegExp(`${searchText}`, "i") },
      ],
    });
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


/* update - addRemoveFriend */

/* 친구 추가 삭제 
  req.params에 id, friendId
*/
export const addRemoveFriend = async (req, res) => {
  //console.log(req.params);
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);
    //console.log(user, friend);

    if (user.friends.includes(friendId)) {
      /* 선택한 친구가 친구목록에 있다면, 친구목록에서 선택한 친구를 지워주기 */
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();

    //*****비동기를 병렬처리 
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
