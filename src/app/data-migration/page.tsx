'use client'

import { FileUpload, Storage } from "@mui/icons-material";
import { Backdrop, Box, CircularProgress, InputLabel, Skeleton, Stack, Typography } from "@mui/material";
import { useCheckSessionVersion } from "../hooks/useCheckSessionVersion";
import { useSession } from "next-auth/react";
import AccessDenied from "../components/shared/AccessDenied";
import LinearProgressWithLabel from "../components/shared/LinearProgressWithLabel";
import { useDropzone } from "react-dropzone";
import { useState } from "react";
import Papa from "papaparse";
import * as XLSX from 'xlsx'; 
import { useMutation } from "@apollo/client";
import { bulkMigrationWordsMutation } from "./query";
import { WordInput } from "../generated/gql/graphql";
import { useSnackbar } from "../hooks/useSnackbar";

const DataMigration = () => {
  useCheckSessionVersion();
  const { data: session } = useSession();

  const { dispatchCurrentSnackBar } = useSnackbar();

  const [getLoader, setLoader] = useState(false);
  const [progress, setProgress] = useState(0);

  const [bulkMigrationWords] = useMutation(bulkMigrationWordsMutation);

  const onBulkMigration = (inputs: WordInput[]) => {
    setLoader(true);
    bulkMigrationWords({
      variables: {
        inputs: inputs,
      },
      onError: (error) => {
        setLoader(false);
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
            message: '데이터 마이그레이션이 성공적으로 완료되었습니다.',
          },
        });
        setLoader(false);
      },
    });
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

                const filteredRows = rows
                  .filter((row) => row.some((cell) => cell !== ""))
                  .map((row) => row.filter((cell, index, arr) => {
                    if (index > 1 && arr[index-1]) {
                      return true;
                    }
                    return cell !== "";
                  }));
                  
                // If rows are present and at least one header exists
                if (filteredRows.length > 1) {
                  const headers = filteredRows[0]; // First row as headers
                  const totalRows = filteredRows.length - 1;
                  let processedRows = 0;

                  const jsonData = filteredRows.slice(1).map((row: any[], i) => {
                    let obj: { [key: string]: string } = {};
                    headers.map((header, index) => {
                      obj[header] = row[index]; // Map each row value to its respective header
                    });
  
                    processedRows++;
                    setProgress(Math.min((processedRows / totalRows) * 100, 100));
  
                    return {
                      pages: [Number(obj['쪽'])],
                      title: obj['단어'],
                      naverDicResults: obj['뜻'] ? obj['뜻'].split(/(?<=\.)/).map(item => item.trim()).filter(Boolean) : [],
                      examples: obj['예문'] ? obj['예문'].split(/(?<=\.)/).map(item => item.trim()).filter(Boolean) : [],
                    };
                  });

                  onBulkMigration(jsonData);
                }
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
              const jsonData = rows.slice(1).map((row: any[], i) => {
                let obj: { [key: string]: string } = {};
                headers.map((header, index) => {
                  obj[header] = row[index]; // Map each row value to its respective header
                });

                processedRows++;
                setProgress(Math.min((processedRows / totalRows) * 100, 100));

                return {
                  pages: [Number(obj['쪽'])],
                  title: obj['단어'],
                  naverDicResults: obj['뜻'] ? obj['뜻'].split(/(?<=\.)/).map(item => item.trim()).filter(Boolean) : [],
                  examples: obj['예문'] ? obj['예문'].split(/(?<=\.)/).map(item => item.trim()).filter(Boolean) : [],
                };
              });

              onBulkMigration(jsonData);
            }
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

  if (session?.user.role !== 'SUPERADMIN') {
    return <AccessDenied/>;
  }

  return (
    <Box 
      width={'100%'} 
      display={'flex'} 
      justifyContent={'center'} 
      alignItems={'center'} 
      flexDirection={'column'}
    >
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={getLoader}
        onClick={() => setLoader(false)}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
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
          <Storage color='info' sx={{ width: '40px', height: '40px' }}/>
          <Typography variant={'h5'}>데이터 마이그레이션</Typography>
        </Stack>
        <Box>
          <Box 
            display={'flex'} 
            flexDirection={'row'} 
            alignItems={'center'} 
            justifyContent={'space-between'}
            sx={{
              '@media (max-width:415px)': {
                alignItems: 'flex-end',
              }
            }}
          >
            <InputLabel sx={{ marginBottom: 1 }} required>CSV 혹은 엑셀 파일을 업로드하세요.</InputLabel>
          </Box>
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
          <LinearProgressWithLabel value={progress} />
        </Box>
      </Stack>
    </Box>
  );
}

export default DataMigration;