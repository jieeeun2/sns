import { Box, useMediaQuery } from '@mui/material'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import Navbar from 'scenes/navbar'
import MyPostWidget from 'scenes/widgets/MyPostWidget'
import PostsWidget from 'scenes/widgets/PostsWidget'
import SearchWidget from 'scenes/widgets/SearchWidget'
import UserWidget from 'scenes/widgets/UserWidget'
import AdvertWidget from './../widgets/AdvertWidget'
import FriendListWidget from './../widgets/FriendListWidget'
import { useEffect } from 'react';

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)")
  const { _id, picturePath } = useSelector(state => state.user)
  const [isSearch, setIsSearch] = useState(false)
  const [searchResult, setSearchResult] = useState(null)

  const handleSetSearch = (isSearch, searchResult) => {
    console.log(isSearch, searchResult)
    setIsSearch(isSearch)
    setSearchResult(searchResult)
  }
  
  return (
    <Box>
      <Navbar handleSetSearch={handleSetSearch}/>
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
      ) : (
        <Box
          width="100%"
          padding="2rem 6%"
          display={isNonMobileScreens ? "flex" : "block"}
          gap="2.5rem"
          justifyContent="space-between"
        >
          <Box>
            <SearchWidget searchResult={searchResult}/>
          </Box>
          {isNonMobileScreens && 
            <Box flexBasis="26px">
              <AdvertWidget />
              <Box m="2rem 0" />
              <FriendListWidget userId={_id}/>
            </Box>
          }
        </Box>
        )}
    </Box>
  )
}

export default HomePage