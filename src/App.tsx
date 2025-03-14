import type { ChangeEvent, FC } from 'react';
import { useState } from 'react';

import LogFileItem from '@/components/LogFileItem';

import { useLogFile } from './contexts/LogFileContext';

import { Box, Button, Typography } from '@mui/material';

export interface MetaData {
  appVersion: string;
  platformOS: string;
  platformVersion: string | number;
  platformConstants: object;
  opendtuVersion: string | null;
}

const App: FC = () => {
  const { logFile, setLogFile } = useLogFile();
  const [meta, setMeta] = useState<MetaData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // file upload handler
  const handleImportLogFile = (event: ChangeEvent<HTMLInputElement>): void => {
    setError(null);
    setLogFile(null);

    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        try {
          if (e.target) {
            if (typeof e.target.result !== 'string') {
              console.error(
                'Invalid log file format, expected string, got',
                typeof e.target.result,
              );
              throw new Error('Invalid log file format');
            }

            let parsed = JSON.parse(e.target.result);

            const isNewFormat = typeof parsed === 'object' && parsed !== null;

            const meta = isNewFormat ? parsed.meta : null;

            if (meta) {
              setMeta(meta);
            }

            parsed = isNewFormat ? parsed.logs : parsed;

            if (!Array.isArray(parsed)) {
              console.error(
                'Invalid log file format, expected array, got',
                typeof parsed,
              );
              throw new Error('Invalid log file format');
            }

            if (parsed.some(entry => typeof entry !== 'object')) {
              console.error(
                'Invalid log file format, expected array of objects',
              );
              throw new Error('Invalid log file format');
            }

            // every object needs to have these properties
            const requiredPropsMap = new Map([
              ['msg', 'string'],
              ['rawMsg', 'array'],
              ['level', 'object'],
              ['extension', 'string'],
              ['options', 'object'],
              ['timestamp', 'string'],
              ['uuid', 'string'],
            ]);

            parsed.some(entry => {
              const keys = Object.keys(entry);
              return (
                keys.length !== requiredPropsMap.size ||
                keys.some(key => {
                  const requiredType = requiredPropsMap.get(key);

                  if (!requiredType) {
                    console.error(
                      `Invalid log file format, unknown key ${key}`,
                    );
                    throw new Error(
                      `Invalid log file format, unknown key ${key}`,
                    );
                  }

                  if (requiredType === 'array') {
                    if (!Array.isArray(entry[key])) {
                      console.error(
                        `Invalid log file format, expected array for key ${key}, got ${typeof entry[key]}`,
                      );
                      throw new Error(
                        `Invalid log file format, expected array for key ${key}, got ${typeof entry[key]}`,
                      );
                    }

                    return true;
                  }

                  if (typeof entry[key] !== requiredType) {
                    console.error(
                      `Invalid log file format, expected ${requiredType} for key ${key}, got ${typeof entry[key]}`,
                    );
                    throw new Error(
                      `Invalid log file format, expected ${requiredType} for key ${key}, got ${typeof entry[key]}`,
                    );
                  }
                })
              );
            });

            setLogFile(parsed);
          }
        } catch (error) {
          if (error instanceof Error) {
            setError(error.message);
          } else {
            setError('An unknown error occurred');
          }
        }
      };
      reader.readAsText(file);
    }

    event.target.value = '';
  };

  return (
    <Box pb={1} display="flex" flexDirection="column" gap={1}>
      <Box
        borderBottom={1}
        bgcolor="grey.800"
        display="flex"
        alignItems="center"
        flexDirection="row"
        gap={2}
        py={1}
        px={2}
      >
        <Typography variant="h3">Log Viewer</Typography>
        <Button variant="contained" component="label">
          Upload File
          <input
            type="file"
            accept=".txt"
            onChange={handleImportLogFile}
            hidden
          />
        </Button>
      </Box>
      <Box>
        {error ? (
          <Typography variant="subtitle1" color="error">
            Error: {error}
          </Typography>
        ) : null}
      </Box>
      {meta ? (
        <Box
          px={1}
          display="flex"
          flexDirection="row"
          gap={1}
          sx={{
            '& > *': {
              borderRight: '1px solid',
              padding: '0 1rem',
            },
          }}
        >
          <Typography variant="subtitle1">
            App Version: {meta.appVersion || 'N/A'}
          </Typography>
          <Typography variant="subtitle1">
            Platform OS: {meta.platformOS || 'N/A'}
          </Typography>
          <Typography variant="subtitle1">
            Platform Version: {meta.platformVersion || 'N/A'}
          </Typography>
          <Typography variant="subtitle1">
            Opendtu Version: {meta.opendtuVersion || 'N/A'}
          </Typography>
        </Box>
      ) : null}
      <Box display="flex" flexDirection="column" gap={1}>
        {logFile?.map((entry, index, { length }) => (
          <LogFileItem
            key={entry.uuid}
            logFileItem={entry}
            index={index}
            length={length}
          />
        ))}
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        p={1}
        m={2}
        overflow="auto"
        border={1}
        borderRadius={3}
      >
        {logFile?.map((entry, index) => (
          <Box key={index}>
            <pre
              style={{
                margin: 0,
                color: entry.level.text === 'error' ? 'red' : 'white',
              }}
            >
              {entry?.msg?.replace(/\w*\n\w*/g, '')}
            </pre>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default App;
