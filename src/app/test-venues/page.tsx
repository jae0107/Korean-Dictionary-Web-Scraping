'use client'

import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { useCheckSessionVersion } from "../hooks/useCheckSessionVersion";
import { useSession } from "next-auth/react";
import { ExamIcon } from "../components/shared/icons/ExamIcon";
import { AddCircleOutline } from "@mui/icons-material";
import { useQuery } from "@apollo/client";
import { getTestVenuesQuery } from "./query";
import usePaginationModel from "../hooks/usePaginationModel";
import { useSnackbar } from "../hooks/useSnackbar";
import { useState } from "react";
import { TestVenueStatus } from "../generated/gql/graphql";
import TestVenueCreationPopUp from "../components/test-venues/TestVenueCreationPopUp/TestVenueCreationPopUp";
import { useSearchParams } from "next/navigation";
import TestVenueFilter from "../components/test-venues/TestVenueFilter/TestVenueFilter";
import TestVenueTable from "../components/test-venues/TestVenueTable/TestVenueTable";

const TestVenues = () => {
  useCheckSessionVersion();
  const { data: session } = useSession();

  const { paginationModel, setPaginationModel } = usePaginationModel();
  const { dispatchCurrentSnackBar } = useSnackbar();
  const searchParams = useSearchParams();

  const [getStatus, setStatus] = useState<TestVenueStatus>(searchParams.get('status') as TestVenueStatus || TestVenueStatus.Open);
  const [getOpenCreationPopUp, setOpenCreationPopUp] = useState<boolean>(false);
  const [getYear, setYear] = useState<string>('');
  const [getClass, setClass] = useState<string>('');
  
  const { data, loading, refetch } =
    useQuery(getTestVenuesQuery, {
      fetchPolicy: 'network-only',
      variables: {
        paginationOptions: {
          limit: paginationModel.pageSize,
          pageNum: paginationModel.page,
        },
        filterOptions: {
          status: getStatus,
          year: Number(getYear),
          class: getClass,
        },
      },
      onError: (error) => {
        dispatchCurrentSnackBar({
          payload: {
            open: true,
            type: 'error',
            message: error.message,
          },
        });
      },
    });
  
  return (
    <Stack
      width={'100%'} 
      display={'flex'} 
      alignItems={'center'}
    >
      <Box 
        width={'90%'} 
        display={'flex'} 
        alignItems={'center'} 
        justifyContent={'space-between'} 
        pb={2}
        sx={{
          '@media (max-width:545px)': {
            width: '95% !important',
          }
        }}
      >
        <Stack spacing={1} direction={'row'} alignItems={'center'}>
          <Box color={'primary.main'} display={'flex'} alignItems={'center'}>
            <ExamIcon style={{ height: '40px', width: '40px' }}/>
          </Box>
          <Typography variant={'h5'}>
            테스트 목록
          </Typography>
        </Stack>
        {
          session?.user.role !== 'STUDENT' &&
          <Button variant="contained" startIcon={<AddCircleOutline/>} onClick={() => setOpenCreationPopUp(true)}>
            테스트 생성
          </Button>
        }
      </Box>
      <Divider sx={{ width: '100%' }}/>
      {
        session?.user.role !== 'STUDENT' &&
        <Box display={'flex'} justifyContent={'center'} width={'100%'}>
          <TestVenueFilter
            getStatus={getStatus}
            setStatus={setStatus}
            getYear={getYear}
            setYear={setYear}
            getClass={getClass}
            setClass={setClass}
          />
        </Box>
      }
      <Box display={'flex'} alignItems={'center'} flexDirection={'column'} width={'100%'}>
        <TestVenueTable
          loading={loading}
          testVenues={data?.getTestVenues.records || []}
          pageCount={data?.getTestVenues.pageInfo.pageCount || 0}
          page={paginationModel.page}
          refetch={refetch}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          testVenueStatus={getStatus}
          myYear={session?.user.year}
          myClass={session?.user.class}
          myRole={session?.user.role}
        />
      </Box>
      <TestVenueCreationPopUp
        open={getOpenCreationPopUp}
        setOpen={setOpenCreationPopUp}
        refetch={refetch}
      />
    </Stack>
  );
}

export default TestVenues;