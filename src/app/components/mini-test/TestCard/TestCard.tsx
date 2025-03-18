import { MiniTestItemsFragment } from '@/app/generated/gql/graphql';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { Backdrop, Box, Button, CircularProgress, FormControl, FormControlLabel, List, ListItem, MobileStepper, Modal, Radio, RadioGroup, Stack, Typography, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import korDicLogo from "../../../../assets/images/korDicLogo.png";
import naverLogo from "../../../../assets/images/naverLogo.png";
import FeedbackPopUp from './FeedbackPopUp/FeedbackPopUp';
import { Session } from 'next-auth';
import { UpdateSession } from '@/app/types/types';
import { useMutation } from '@apollo/client';
import { createTestResultMutation } from './query';
import { useSnackbar } from '@/app/hooks/useSnackbar';

const TestCard = ({
  tests,
  session,
  update,
  isReal,
  testVenueId,
} : {
  tests: MiniTestItemsFragment[];
  session: Session | null;
  update: UpdateSession;
  isReal: boolean;
  testVenueId?: string;
}) => {
  const theme = useTheme();
  const { dispatchCurrentSnackBar } = useSnackbar();
  
  const [activeStep, setActiveStep] = useState(0);
  const [countdown, setCountdown] = useState(13);
  const [getMyAnswers, setMyAnswers] = useState<{ [key: number]: string }>({});
  const [getCorrectScores, setCorrectScores] = useState<number>(0);
  const [getWrongWords, setWrongWords] = useState<MiniTestItemsFragment[]>([]);
  const [openFeedback, setOpenFeedback] = useState(false);
  const [ableButton, setAbleButton] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);

  const [createTestResult] = useMutation(createTestResultMutation);

  const maxSteps = tests.length;

  const getCorrectScore = () => {
    return tests.reduce((score, test, index) => {
      if (getMyAnswers[index] === test.correctAnswer) {
        return score + 1;
      }
      return score;
    }, 0);
  };

  const getWrongIndexes = () => {
    return tests.reduce<number[]>((wrongIndexes, test, index) => {
      if (getMyAnswers[index] !== test.correctAnswer) {
        wrongIndexes.push(index);
      }
      return wrongIndexes;
    }, []);
  };

  useEffect(() => {
    const updateSession = async () => {
      await update({ user: { ...session?.user, isInTestMode: false } });
    };

    if (countdown === 0) {
      if (activeStep < maxSteps - 1) {
        handleNext();
      } else if (activeStep === maxSteps - 1) {
        setAbleButton(true);
        updateSession();
        const score = getCorrectScore();
        setCorrectScores(score);
        setWrongWords(getWrongIndexes().map((index) => tests[index]));

        if (isReal && testVenueId) {
          setLoader(true);
          createTestResult({
            variables: {
              input: {
                testVenueId: testVenueId,
                testScore: score,
              },
            },
            onError: async (error) => {
              setLoader(false);
              dispatchCurrentSnackBar({
                payload: {
                  open: true,
                  type: 'error',
                  message: error.message,
                },
              });
            },
            onCompleted: () => {
              setLoader(false);
              dispatchCurrentSnackBar({
                payload: {
                  open: true,
                  type: 'success',
                  message: '테스트 결과가 제출되었습니다.',
                },
              });
              setOpenFeedback(true);
            },
          });
        } else {
          setOpenFeedback(true);
        }
      }
      return;
    }
  

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, activeStep]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setCountdown(13);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const getResults = (results: string[]) => {
    return (
      <Box display={'flex'} flexDirection={'column'}>
        <List sx={{ pt: 0, pb: 0 }}>
          {
            results.map((item, index) => (
              <ListItem key={index} sx={{ pl: 0, pr: 0, '&.MuiListItem-padding': { pt: 0 } }} dense>
                <Typography variant={'body2'}>
                  • {item}
                </Typography>
              </ListItem>
            ))
          }
        </List>
      </Box>
    );
  };

  return (
    <Box 
      width={'800px'} 
      border={`2px solid ${theme.palette.mode === 'dark' ? '#515151' : '#b4b4b4'}`} 
      bgcolor={theme.palette.mode === 'dark' ? '#353535' : '#f4f6f8'}
      borderRadius={2} 
      position={'relative'}
      sx={{
        '@media (max-width:830px)': {
          width: '95% !important',
        }
      }}
    >
      <Modal open={loader} onClick={() => setLoader(false)}>
        <Backdrop
          sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
          open={loader}
          onClick={() => setLoader(false)}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Modal>
      <Box display={'flex'} justifyContent={'center'} p={4} position={'relative'}>
        <Box position="absolute" top={8} right={16}>
          <Box position="relative" display="inline-flex">
            <CircularProgress variant="determinate" value={100} sx={{ color: theme.palette.mode === 'dark' ? '#d3d3d3' : '#f3eeee' }} size={50} />
            <CircularProgress
              variant="determinate"
              value={(countdown / 13) * 100}
              size={50}
              color={countdown <= 3 ? 'error' : countdown <= 6 ? 'warning' : 'primary'}
              sx={{ position: 'absolute', left: 0 }}
            />
            <Box
              top={0}
              left={0}
              bottom={0}
              right={0}
              position="absolute"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Typography fontWeight="bold" fontSize="1.2rem">
                {countdown}
              </Typography>
            </Box>
          </Box>
        </Box>
        {
          ableButton && 
          <Box position="absolute" bottom={8} right={16}>
            <Box position="relative" display="inline-flex">
              <Button 
                disabled={!ableButton} 
                onClick={() => setOpenFeedback(true)}
                variant={'contained'}
              >
                결과 보기
              </Button>
            </Box>
          </Box>
        }
        <Stack spacing={2} display={'flex'} flexDirection={'column'}>
          {
            tests[activeStep].korDicResults && tests[activeStep].korDicResults.length > 0 && 
            <Stack spacing={1}>
              <Stack spacing={1} direction={'row'} alignItems={'center'}>
                <img 
                  src={korDicLogo.src}
                  style={{ 
                    width: '2rem', 
                    height: '2rem', 
                    background: 'white',
                    borderRadius: '50%',
                    border: '1px solid #807c7c87',
                  }}
                />
                <Typography fontWeight={'bold'}>국립국어원</Typography>
              </Stack>
              <Box>
                {getResults(tests[activeStep].korDicResults)}
              </Box>
            </Stack>
          }
          {
            tests[activeStep].naverDicResults && tests[activeStep].naverDicResults.length > 0 && 
            <Stack spacing={1}>
              <Stack spacing={1} direction={'row'} alignItems={'center'}>
                <img 
                  src={naverLogo.src}
                  style={{ 
                    width: '2rem', 
                    height: '2rem', 
                    background: 'white',
                    borderRadius: '50%',
                    border: '1px solid #807c7c87',
                  }}
                />
                <Typography fontWeight={'bold'}>네이버</Typography>
              </Stack>
              <Box>
                {getResults(tests[activeStep].naverDicResults)}
              </Box>
            </Stack>
          }
          <FormControl>
            <RadioGroup 
              row 
              onChange={(e) => setMyAnswers((prev) => ({ ...prev, [activeStep]: e.target.value }))}
              value={getMyAnswers[activeStep] ?? ''}
            >
              {
                tests[activeStep].options.map((option, i) => (
                  <FormControlLabel key={i} value={option} control={<Radio />} label={option} />
                ))
              }
            </RadioGroup>
          </FormControl>
        </Stack>
      </Box>
      <MobileStepper
        variant="text"
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        nextButton={
          <Button
            variant='outlined'
            size="small"
            onClick={handleNext}
            disabled={isReal || activeStep === maxSteps - 1}
            endIcon={theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            sx={{
              '&.MuiButtonBase-root .MuiButton-endIcon': {
                ml: 0
              }
            }}
          >
            다음
          </Button>
        }
        backButton={
          <Button 
            variant='outlined' 
            size="small" 
            onClick={handleBack} 
            disabled={true}
            startIcon={theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            sx={{
              '&.MuiButtonBase-root .MuiButton-startIcon': {
                mr: 0
              }
            }}
          >
            이전
          </Button>
        }
        sx={{
          borderTop: `2px solid ${theme.palette.mode === 'dark' ? '#515151' : '#b4b4b4'}`,
          bgcolor: theme.palette.mode === 'dark' ? '#353535' : '#f4f6f8'
        }}
      />
      <FeedbackPopUp
        openFeedback={openFeedback}
        setOpenFeedback={setOpenFeedback}
        score={getCorrectScores}
        getWrongWords={getWrongWords}
        numOfTests={tests.length}
        isReal={isReal}
      />
    </Box>
  );
}

export default TestCard;