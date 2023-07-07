import User from '../models/User.js'

/* read */
export const getUser = async (req, res) => {
  console.log('req.params', req.params)
  try {
    const { id } = req.params
    const user = await User.findById(id)
    console.log('user', user)
    res.status(200).json(user)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findById(id)

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    )
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath }
      }
    )
    res.status(200).json(formattedFriends)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}


/* update */
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params
    const user = await User.findById(id)
    const friend = await User.findById(friendId)

    if(user.friends.includes(friendId)) { 
      user.friends = user.friends.filter((id) => id !== friendId) //이 과정이 왜 필요한건데???
      friend.friends = friend.friends.filter((id) => id !== id)
    } else {
      user.friends.push(friendId)
      friend.friends.push(id)
    }
    await user.save()
    await friend.save()

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    )
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath }
      }
    )
    
    res.status(200).json(formattedFriends)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}