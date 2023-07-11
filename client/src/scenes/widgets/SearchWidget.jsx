import { useTheme } from '@emotion/react';
import { Typography } from '@mui/material';
import WidgetWrapper from 'components/WidgetWrapper';
import Friend from 'components/Friend';

const SearchWidget = ({searchResult}) => {
  const { palette } = useTheme()
  const main = palette.neutral.main

  return (
    <WidgetWrapper>
      <Typography color={main}>
        Search Results...
      </Typography>
      {searchResult.length > 0 && searchResult.map(
        ({_id, firstName, lastName, location, picturePath}) => (
          <Friend 
            key={_id}
            friendId={_id}
            name={`${firstName} ${lastName}`}
            subtitle={location}
            userPicturePath={picturePath}
          />
        )
      )}

    </WidgetWrapper>
  )
}

export default SearchWidget