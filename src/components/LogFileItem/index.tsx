import type { FC } from 'react';

import Pre from '@/components/Pre';

import type { LogFileItemType } from '@/contexts/LogFileContext';

import { Box, Typography } from '@mui/material';

export interface LogFileItemProps {
  logFileItem: LogFileItemType;
  index: number;
  length: number;
}

const looksLikeError = (originalMsg: object): Error | false => {
  try {
    let msg = originalMsg;

    if (typeof msg !== 'object') {
      return false;
    }

    if ('error' in msg && typeof msg.error === 'object' && msg.error !== null) {
      msg = msg.error;
    }

    if (!('message' in msg)) {
      return false;
    }

    if (typeof msg.message === 'string') {
      return msg as Error;
    }

    return false;
  } catch {
    return false;
  }
};

const LogFileItem: FC<LogFileItemProps> = ({ logFileItem, index, length }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      p={2}
      border={1}
      borderRadius={2}
      borderColor="grey.800"
      bgcolor="grey.900"
    >
      <Box>
        {Array.isArray(logFileItem.rawMsg) ? (
          <Box>
            {logFileItem.rawMsg.map((msg, index) => {
              const error = looksLikeError(msg);

              if (error) {
                return (
                  <Box key={index}>
                    <Typography color="error">{error.message}</Typography>
                    <Pre>{error.stack}</Pre>
                  </Box>
                );
              } else {
                return (
                  <Box key={index}>
                    <Typography>{JSON.stringify(msg, null, 2)}</Typography>
                  </Box>
                );
              }
            })}
          </Box>
        ) : (
          <Box>{logFileItem.msg}</Box>
        )}
      </Box>
      <Box>{logFileItem.timestamp}</Box>
    </Box>
  );
};

export default LogFileItem;
