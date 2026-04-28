import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import type { TimelineEventPoint } from '../data/timelineEvents';

export interface TimelineMarkerFocusPanelProps {
  event: TimelineEventPoint | null;
  onClear: () => void;
}

export function TimelineMarkerFocusPanel({ event, onClear }: TimelineMarkerFocusPanelProps) {
  if (!event) return null;

  return (
    <Paper
      variant="outlined"
      sx={{
        mx: { xs: 1, sm: 2 },
        mb: 1,
        p: 2,
        bgcolor: 'action.hover',
      }}
    >
      <Stack spacing={1}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" gap={1}>
          <Typography variant="overline" color="text.secondary">
            {event.name}
          </Typography>
          <IconButton aria-label="Clear selection" size="small" onClick={onClear}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
        <Typography variant="subtitle1" fontWeight={600}>
          {event.label}
        </Typography>
        <Typography variant="body2" sx={{ lineHeight: 1.65 }}>
          {event.description}
        </Typography>
      </Stack>
    </Paper>
  );
}
