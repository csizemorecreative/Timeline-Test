import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect } from 'react';

import type { TimelineEventPoint } from '../data/timelineEvents';
import { TIMELINE_PLACEHOLDER_IMAGE } from '../timelinePlaceholderAsset';

export interface TimelineSlideshowDialogProps {
  open: boolean;
  onClose: () => void;
  events: TimelineEventPoint[];
  index: number;
  onIndexChange: (index: number) => void;
}

export function TimelineSlideshowDialog({
  open,
  onClose,
  events,
  index,
  onIndexChange,
}: TimelineSlideshowDialogProps) {
  const ev = events[index];
  const canPrev = index > 0;
  const canNext = index < events.length - 1;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (canPrev) onIndexChange(index - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (canNext) onIndexChange(index + 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, index, canPrev, canNext, onIndexChange]);

  if (!ev) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="timeline-slideshow-title"
    >
      <DialogTitle
        component="div"
        id="timeline-slideshow-title"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          pr: 1,
        }}
      >
        <IconButton
          aria-label="Previous event"
          onClick={() => canPrev && onIndexChange(index - 1)}
          disabled={!canPrev}
          size="small"
        >
          <ChevronLeft />
        </IconButton>
        <Typography variant="subtitle2" sx={{ flex: 1, textAlign: 'center' }}>
          {index + 1} / {events.length}
        </Typography>
        <IconButton
          aria-label="Next event"
          onClick={() => canNext && onIndexChange(index + 1)}
          disabled={!canNext}
          size="small"
        >
          <ChevronRight />
        </IconButton>
        <IconButton aria-label="Close" onClick={onClose} size="small" sx={{ ml: 'auto' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems={{ xs: 'stretch', sm: 'flex-start' }}
          >
            <Box
              component="img"
              src={TIMELINE_PLACEHOLDER_IMAGE}
              alt=""
              sx={{
                flexShrink: 0,
                width: { xs: '100%', sm: 140 },
                height: { xs: 160, sm: 140 },
                objectFit: 'contain',
                borderRadius: 1,
                display: 'block',
              }}
              aria-hidden
            />
            <Stack spacing={2} sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="overline" color="text.secondary">
                {ev.name}
              </Typography>
              <Typography variant="h6" component="h2">
                {ev.label}
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                {ev.description}
              </Typography>
            </Stack>
          </Stack>
          <Typography variant="caption" color="text.secondary">
            Use arrow keys (← →) to move between items.
          </Typography>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
