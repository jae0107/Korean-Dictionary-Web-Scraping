import { Box, LinearProgress, LinearProgressProps, Typography } from "@mui/material";

const LinearProgressWithLabel = (props: LinearProgressProps & { value: number }) => {
  return (
    <Box display={'flex'} alignItems={'center'}>
      <Box width={'100%'} mr={1}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary' }}
        >
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

export default LinearProgressWithLabel;