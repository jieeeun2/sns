import { Box } from '@mui/material'
import Navbar from 'scenes/navbar'
import { useMediaQuery } from '@mui/material'
import { useSelector } from 'react-redux'
import UserWidget from 'scenes/widgets/UserWidget'
import MyPostWidget from 'scenes/widgets/MyPostWidget'
import PostsWidget from 'scenes/widgets/PostsWidget'
import AdvertWidget from './../widgets/AdvertWidget';
import FriendListWidget from './../widgets/FriendListWidget';

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)")
  const { _id, picturePath } = useSelector(state => state.user)
  const isSearch = useSelector(state => state.isSearch)
  console.log(isSearch)

  return (
    <Box>
      <Navbar userId={_id}/>
      {!isSearch ? (
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={_id} picturePath={picturePath}/>
        </Box>
        <Box 
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <MyPostWidget picturePath={picturePath} />
          <PostsWidget userId={_id} isProfile/>
        </Box>
        {isNonMobileScreens && 
          <Box flexBasis="26px">
            <AdvertWidget />
            <Box m="2rem 0" />
            <FriendListWidget userId={_id}/>
          </Box>
        }
      </Box>
      ): (
        <Box>dd</Box>
      )}
    </Box>
  )
}

export default HomePage