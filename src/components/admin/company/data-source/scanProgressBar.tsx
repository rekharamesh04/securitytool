import React, { useEffect, useState } from 'react';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  LinearProgress,
  Slide,
  keyframes,
  styled,
  useTheme
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import CircularProgress from '@mui/material/CircularProgress';

// Define the props interface
interface ScanProgressDialogProps {
  open: boolean;
  progress: number;
  onComplete?: () => void;
  onClose?: () => void;
}

// Styled components
const AnimatedProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 14,
  borderRadius: 7,
  backgroundColor: theme.palette.grey[200],
  overflow: 'hidden',
  position: 'relative',
  '& .MuiLinearProgress-bar': {
    borderRadius: 7,
    background: `linear-gradient(90deg,
      ${theme.palette.primary.main} 0%,
      ${theme.palette.secondary.main} 100%)`,
    transition: 'transform 0.6s cubic-bezier(0.65, 0, 0.35, 1)',
    '&:after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `linear-gradient(
        90deg,
        rgba(255,255,255,0.8) 0%,
        rgba(255,255,255,0) 100%
      )`,
      animation: `${keyframes`
        0% { opacity: 0.6; }
        50% { opacity: 1; }
        100% { opacity: 0.6; }
      `} 2s infinite`,
    }
  },
}));

const PercentageText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '2.5rem',
  background: `linear-gradient(90deg,
    ${theme.palette.primary.main} 0%,
    ${theme.palette.secondary.main} 100%)`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  display: 'inline-block',
  animation: `${keyframes`
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  `} 3s ease-in-out infinite`,
}));

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ScanProgressDialog: React.FC<ScanProgressDialogProps> = ({
  open,
  progress,
  onComplete,
  onClose
}) => {
  const theme = useTheme();
  const [prevProgress, setPrevProgress] = useState(0);

  useEffect(() => {
    if (progress === 100 && prevProgress < 100) {
      // Call onComplete first if needed
      onComplete?.();

      // Then close the dialog after a slight delay
      const timer = setTimeout(() => {
        onClose?.();
      }, 500); // Short delay for smooth transition

      return () => clearTimeout(timer);
    }
    setPrevProgress(progress);
  }, [progress, onComplete, onClose, prevProgress]);

  return (
    <Dialog
      open={open}
      maxWidth="sm"
      fullWidth
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      PaperProps={{
        sx: {
          p: 3,
          borderRadius: 3,
          boxShadow: '0px 15px 30px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          background: theme.palette.mode === "light"
          ? "#f7f7f7"
          : theme.palette.background.default,
      color: theme.palette.text.primary,
          overflow: 'visible',
          transform: 'translateY(0)',
          transition: 'transform 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
          },
          '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 20,
            right: 20,
            height: 4,
            borderRadius: 3,
            background: `linear-gradient(90deg,
              ${theme.palette.primary.main} 0%,
              ${theme.palette.secondary.main} 100%)`,
            animation: `${keyframes`
              0% { box-shadow: 0 0 0 0 rgba(63, 81, 181, 0.4); }
              70% { box-shadow: 0 0 0 12px rgba(63, 81, 181, 0); }
              100% { box-shadow: 0 0 0 0 rgba(63, 81, 181, 0); }
            `} 3s infinite`,
          }
        }
      }}
    >
   <DialogTitle sx={{
  textAlign: 'center',
  pb: 2,
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '40%',
    height: 2,
    background: `linear-gradient(90deg,
      transparent,
      ${theme.palette.primary.main},
      transparent)`,
  }
}}>
  Scanning Data Source
</DialogTitle>

      <DialogContent sx={{ py: 4, position: 'relative', minHeight: 180 }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Box sx={{
            width: '100%',
            position: 'relative',
            mb: 4,
          }}>
            <AnimatedProgressBar
              variant="determinate"
              value={progress}
            />
          </Box>

          <PercentageText>
            {progress}%
          </PercentageText>

          <Typography
            variant="body2"
            sx={{
              textAlign: 'center',
              mt: 2,
              color: 'text.secondary',
              maxWidth: '80%',
              animation: `${keyframes`
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-8px); }
              `} 4s ease-in-out infinite 0.5s`,
            }}
          >
            {progress < 30
              ? 'Initializing scan components...'
              : progress < 70
                ? 'Connecting...'
                : 'Finalizing results...'}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{
        justifyContent: 'center',
        pt: 0,
        pb: 2,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CircularProgress
            size={16}
            thickness={6}
            sx={{ mr: 1, color: theme.palette.primary.main }}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              fontSize: '0.75rem',
            }}
          >
            {progress < 30
              ? 'Preparing resources...'
              : progress < 70
                ? 'Processing in real-time...'
                : 'Optimizing results...'}
          </Typography>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(ScanProgressDialog);