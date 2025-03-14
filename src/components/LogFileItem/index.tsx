import type { FC } from 'react';

import Pre from '@/components/Pre';

import type { LogFileItemType } from '@/contexts/LogFileContext';

import { Box, Divider, Typography } from '@mui/material';

export interface LogFileItemProps {
  logFileItem: LogFileItemType;
  index: number;
  length: number;
}

const looksLikeError = (originalMsg: object): Error | false => {
  try {
    let msg = originalMsg;

    if (typeof msg !== 'object') {
      console.debug('looksLikeError: msg is not an object', { originalMsg });
      return false;
    }

    if ('error' in msg && typeof msg.error === 'object' && msg.error !== null) {
      msg = msg.error;
    }

    if (!('message' in msg)) {
      console.debug('looksLikeError: msg does not have a message property', {
        originalMsg,
      });
      return false;
    }

    if (typeof msg.message === 'string') {
      console.debug('looksLikeError: msg.message is a string', { originalMsg });
      return msg as Error;
    }

    return false;
  } catch (e) {
    console.debug(
      'looksLikeError: error while checking if msg looks like an error',
      e,
      { originalMsg },
    );
    return false;
  }
};

const LogFileItem: FC<LogFileItemProps> = ({ logFileItem }) => {
  console.log('foo', logFileItem)

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
            {logFileItem.rawMsg
              .filter(msg => !!msg)
              .map((msg, index) => {
                const error = looksLikeError(msg);

                console.log(error);

                if (error) {
                  return (
                    <Box key={index}>
                      <Typography color="error">{error.message}</Typography>
                      <Pre>{error.stack || 'No stack available'}</Pre>
                    </Box>
                  );
                } else {
                  return (
                    <Box key={index}>
                      <pre style={{ margin: 0 }}>
                        {index + 1}. {JSON.stringify(msg)}
                      </pre>
                    </Box>
                  );
                }
              })}
          </Box>
        ) : (
          <Box>{logFileItem.msg}</Box>
        )}
      </Box>
      <Divider />
      <Box>{logFileItem.timestamp}</Box>
    </Box>
  );
};

export default LogFileItem;
