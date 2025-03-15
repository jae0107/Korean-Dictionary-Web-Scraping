'use client'

import { Backdrop, Box, CircularProgress, InputLabel, Skeleton, Stack, Typography } from "@mui/material";
import AccessDenied from "../components/shared/AccessDenied";
import {useDropzone} from 'react-dropzone';
import { FileUpload, PersonAdd } from "@mui/icons-material";
import Papa from 'papaparse';
import * as XLSX from 'xlsx'; 
import { useState } from "react";
import { UserInput, UserRole } from "../generated/gql/graphql";
import LinearProgressWithLabel from "../components/shared/LinearProgressWithLabel";
import { ExtendedUserInput, RawJsonDataProps } from "./type";
import { useMutation, useQuery } from "@apollo/client";
import { bulkCreateStudentMutation, getUsersQuery } from "./query";
import usePaginationModel from "../hooks/usePaginationModel";
import { useSnackbar } from "../hooks/useSnackbar";
import AccountCreationContainer from "../components/users/account-creation/AccountCreationContainer/AccountCreationContainer";
import { useCheckSessionVersion } from "../hooks/useCheckSessionVersion";
import { useSession } from "next-auth/react";

const AccountCreation = () => {
  useCheckSessionVersion();
  const { data: session } = useSession();

  const { paginationModel, setPaginationModel } = usePaginationModel();
  const { dispatchCurrentSnackBar } = useSnackbar();

  const [getDuplicateAccounts, setDuplicateAccounts] = useState<ExtendedUserInput[]>([]);
  const [getWrongData, setWrongData] = useState<RawJsonDataProps[]>([]);
  const [getMutationLoading, setMutationLoading] = useState(false);
  const [getLoader, setLoader] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showContainer, setShowContainer] = useState(false);

  const [bulkCreateStudents] = useMutation(bulkCreateStudentMutation);

  const { data, loading } =
    useQuery(getUsersQuery, {
      fetchPolicy: 'network-only',
      variables: {
        paginationOptions: {
          limit: paginationModel.pageSize,
          pageNum: paginationModel.page,
        },
        filterOptions: {
          roles: [],
          statuses: [],
        },
      },
      skip: session?.user.role === "STUDENT" || session?.user.role === "TEACHER",
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

  if (session?.user.role === 'STUDENT') {
    return <AccessDenied/>;
  }

  const onBulkCreate = (inputs: UserInput[]) => {
    setMutationLoading(true);
    bulkCreateStudents({
      variables: {
        inputs: inputs,
      },
      onError: (error) => {
        setMutationLoading(false);
        dispatchCurrentSnackBar({
          payload: {
            open: true,
            type: 'error',
            message: error.message,
          },
        });
      },
      onCompleted: async () => {
        dispatchCurrentSnackBar({
          payload: {
            open: true,
            type: 'success',
            message: '성공적으로 학생 계정들이 생성되었습니다.',
          },
        });
        setMutationLoading(false);
      },
    });
  };

  const findInvalidRows = (jsonData: RawJsonDataProps[]) => {
    return jsonData.filter((row) =>
      Object.entries(row)
        .filter(([key]) => key !== "accountId" && key !== "password")
        .some(([, value]) => value === "" || value === undefined)
    );
  };

  const getJsonData = (jsonData: RawJsonDataProps[]) => {
    const inValidData: RawJsonDataProps[] = findInvalidRows(jsonData);
    const tmpDuplicates: ExtendedUserInput[] = [];
    const tmpCorrectData: UserInput[] = [];

    const currentYear = new Date().getFullYear();

    jsonData.forEach((item) => {
      if (!item.name || typeof item.name !== 'string' || (item.name.trim() === '') || !isNaN(Number(item.name)) || isNaN(Number(item.year)) || isNaN(Number(item.class)) || isNaN(Number(item.number))) {
        const alreadyExists = inValidData.some(
          (existingItem) => existingItem.year === item.year && existingItem.class === item.class && existingItem.number === item.number
        );
        
        if (!alreadyExists) {
          inValidData.push(item);
        }
      }

      const accountId = item.accountId ? item.accountId : `YH${currentYear.toString()}${item.year}${String(item.class).padStart(2, '0')}${String(item.number).padStart(2, '0')}`;
      const password = item.password ? item.password : `${item.year}${String(item.class).padStart(2, '0')}${String(item.number).padStart(2, '0')}`;
      const isDuplicate = data?.getUsers.records.some((record) => record.accountId === accountId) || false; 

      if (isDuplicate) {
        tmpDuplicates.push({
          id: item.id,
          name: item.name,
          year: item.year,
          class: item.class?.toString() || undefined,
          number: item.number,
          accountId: accountId,
          password: password,
          role: UserRole.Student,
        });
      } else if (!isDuplicate && item.name && typeof item.name === 'string' && item.name.trim() !== '' && !isNaN(Number(item.year)) && !isNaN(Number(item.class)) && !isNaN(Number(item.number))) {
        
        tmpCorrectData.push({
          name: item.name,
          year: typeof item.year === 'string' ? parseInt(item.year) : item.year,
          class: item.class?.toString() || undefined,
          number: typeof item.number === 'string' ? parseInt(item.number) : item.number,
          accountId: accountId,
          password: password,
          role: UserRole.Student,
        });
      }
    });

    setWrongData(inValidData);
    setDuplicateAccounts(tmpDuplicates);
    onBulkCreate(tmpCorrectData);
  };

  const {
    acceptedFiles,
    fileRejections,
    getRootProps,
    getInputProps,
  } = useDropzone({
    accept: {
      'text/csv': [], // For CSV files
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [], // For Excel files (.xlsx)
      'application/vnd.ms-excel': [] // For Excel files (.xls)
    },
    multiple: false,
    onDrop: (acceptedFiles) => {
      setShowContainer(true);
      setLoader(true);
      setProgress(0);

      const file = acceptedFiles[0];
      const reader = new FileReader();

      reader.onload = (event) =>  {
        if (event.target) {
          const content = event.target.result;
          if (file.type === 'text/csv') {
            Papa.parse(file, {
              encoding: "UTF-8",
              skipEmptyLines: true,  // Skip completely empty rows
              complete: (result) => {
                let rows: string[][] = result.data as string[][];
                console.log("rows: ", rows)
                const filteredRows = rows
                  .filter((row) => row.some((cell) => cell !== ""))
                  .map((row) => row.filter((cell, index, arr) => {
                    if (index > 1 && arr[index-1]) {
                      return true;
                    }
                    return cell !== "";
                  }));
                  console.log("filteredRows: ", filteredRows)
                // If rows are present and at least one header exists
                if (filteredRows.length > 1) {
                  const headers = filteredRows[0]; // First row as headers
                  const totalRows = filteredRows.length - 1;
                  let processedRows = 0;

                  const jsonData: RawJsonDataProps[] = filteredRows.slice(1).map((row: any[], i) => {
                    let obj: { [key: string]: any } = {};
                    headers.map((header, index) => {
                      obj[header] = row[index]; // Map each row value to its respective header
                    });

                    processedRows++;
                    setProgress(Math.min((processedRows / totalRows) * 100, 100));

                    return {
                      id: i,
                      name: obj['이름'],
                      year: obj['학년'],
                      class: obj['반'],
                      number: obj['번호'],
                      accountId: obj['아이디'],
                      password: obj['비밀번호'],
                    };
                  });
                  console.log("jsonData: ", jsonData)
                  getJsonData(jsonData);
                }
                setLoader(false);
                setProgress(100); 
              },
            });
            
          } else if (
            file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            file.type === 'application/vnd.ms-excel'
          ) {
            const workbook = XLSX.read(content, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            // Convert to array first
            const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            
            if (rows.length > 1) {
              const totalRows = rows.length - 1;
              let processedRows = 0;

              const headers = rows[0] as string[]; // First row as headers
              const jsonData: RawJsonDataProps[] = rows.slice(1).map((row: any[], i) => {
                let obj: { [key: string]: any } = {};
                headers.map((header, index) => {
                  obj[header] = row[index]; // Map each row value to its respective header
                });

                processedRows++;
                setProgress(Math.min((processedRows / totalRows) * 100, 100));

                return {
                  id: i,
                  name: obj['이름'],
                  year: obj['학년'],
                  class: obj['반'],
                  number: obj['번호'],
                  accountId: obj['아이디'],
                  password: obj['비밀번호'],
                };
              });
              getJsonData(jsonData);
            }
            setLoader(false);
            setProgress(100);
          }
        }
      }
      
      if (file.type === 'text/csv') {
        reader.readAsText(file);
      }  else if (
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.ms-excel'
      ) {
        reader.readAsArrayBuffer(file);
      }
    },
  });

  if (!data && !loading) {
    return (
      <Box display={'flex'} justifyContent={'center'} alignItems={'center'} height={'calc(100vh - 86.5px)'}>
        데이터를 불러오는데 실패했습니다.
      </Box>
    );
  }

  return (
    <>
    <Backdrop
      sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
      open={getMutationLoading}
      onClick={() => setMutationLoading(false)}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
    <Box 
      width={'100%'} 
      display={'flex'} 
      justifyContent={'center'} 
      alignItems={'center'} 
      flexDirection={'column'}
    >
      <Stack 
        mt={2} 
        spacing={4}
        sx={{
          '@media (max-width:475px)': {
            width: '95%',
          }
        }}
      >
        <Stack spacing={1} direction={'row'} alignItems={'center'}>
          <PersonAdd color='info' sx={{ width: '40px', height: '40px' }}/>
          <Typography variant={'h5'}>학생 계정 생성</Typography>
        </Stack>
        <Box>
          <InputLabel sx={{ marginBottom: 1 }} required>CSV 혹은 엑셀 파일을 업로드하세요.</InputLabel>
          {
            loading ? 
            <Skeleton variant="rounded" height={120} width={451.36}/> :
            <Box 
              {...getRootProps()} 
              border={'2px dotted #888888'} 
              borderRadius={'5px'}
              height={'120px'} 
              p={5} 
              display={'flex'} 
              justifyContent={'center'} 
              alignItems={'center'}
              bgcolor={'#8888881c'}
            >
              <input {...getInputProps()} onClick={() => setProgress(0)}/>
              <Typography display={'flex'} alignItems={'center'} justifyContent={'center'}>
                <FileUpload sx={{ mr: 1 }}/>드래그 앤 드롭하거나 클릭하여 파일을 업로드하세요.
              </Typography>
            </Box>
          }
          <LinearProgressWithLabel value={progress} />
        </Box>
      </Stack>
    </Box>
    {
      showContainer &&
      <Box width={'100%'} alignItems={'center'} display={'flex'} flexDirection={'column'} mt={2}>
        <AccountCreationContainer
          loading={getLoader}
          getDuplicateAccounts={getDuplicateAccounts}
          getWrongData={getWrongData}
        />
      </Box>
    }
    </>
  );
}

export default AccountCreation;