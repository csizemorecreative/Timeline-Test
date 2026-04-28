import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { clampTimelineRange } from '../data/timelineExtent';

function formatRangeLabel(ms: number): string {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(ms);
}

export interface TimelineRangeScrubberProps {
  domainMin: number;
  domainMax: number;
  rangeStart: number;
  rangeEnd: number;
  onRangeChange: (start: number, end: number) => void;
}

type DragMode = 'pan' | 'resize-left' | 'resize-right';

export function TimelineRangeScrubber({
  domainMin,
  domainMax,
  rangeStart,
  rangeEnd,
  onRangeChange,
}: TimelineRangeScrubberProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const domain = useMemo(
    () => ({ min: domainMin, max: domainMax }),
    [domainMin, domainMax],
  );

  const [drag, setDrag] = useState<{
    mode: DragMode;
    pointerId: number;
    startClientX: number;
    startRange: [number, number];
  } | null>(null);

  const domainSpan = domainMax - domainMin;

  const leftPct =
    domainSpan > 0 ? ((rangeStart - domainMin) / domainSpan) * 100 : 0;
  const widthPct =
    domainSpan > 0 ? ((rangeEnd - rangeStart) / domainSpan) * 100 : 100;

  const applyDelta = useCallback(
    (deltaMs: number, mode: DragMode, startRange: [number, number]) => {
      let s = startRange[0];
      let e = startRange[1];
      if (mode === 'pan') {
        s += deltaMs;
        e += deltaMs;
      } else if (mode === 'resize-left') {
        s += deltaMs;
      } else {
        e += deltaMs;
      }
      const next = clampTimelineRange(s, e, domain);
      onRangeChange(next[0], next[1]);
    },
    [domain, onRangeChange],
  );

  useEffect(() => {
    if (!drag) return;

    const onMove = (ev: PointerEvent) => {
      const track = trackRef.current;
      if (!track) return;
      const w = track.getBoundingClientRect().width;
      if (w <= 0) return;
      const deltaMs = ((ev.clientX - drag.startClientX) / w) * domainSpan;
      applyDelta(deltaMs, drag.mode, drag.startRange);
    };

    const onUp = (ev: PointerEvent) => {
      if (ev.pointerId !== drag.pointerId) return;
      setDrag(null);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [drag, applyDelta, domainSpan]);

  const beginDrag = (mode: DragMode, e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const startRange = [rangeStart, rangeEnd] as [number, number];
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setDrag({
      mode,
      pointerId: e.pointerId,
      startClientX: e.clientX,
      startRange,
    });
  };

  return (
    <Stack spacing={0.75} sx={{ minWidth: 0 }}>
      <Box
        ref={trackRef}
        sx={{
          position: 'relative',
          height: 44,
          borderRadius: 1,
          userSelect: 'none',
          touchAction: 'none',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            bgcolor: 'action.hover',
            borderRadius: 1,
            border: 1,
            borderColor: 'divider',
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            top: 4,
            bottom: 4,
            left: `${leftPct}%`,
            width: `${widthPct}%`,
            bgcolor: 'primary.main',
            opacity: 0.28,
            borderRadius: 0.5,
            pointerEvents: 'none',
          }}
        />

        {/* Pan: drag the shaded band (edges reserved for resize handles). */}
        <Box
          onPointerDown={(e) => beginDrag('pan', e)}
          sx={{
            position: 'absolute',
            top: 4,
            bottom: 4,
            left: `${leftPct}%`,
            width: `${widthPct}%`,
            px: '14px',
            boxSizing: 'border-box',
            cursor: drag?.mode === 'pan' ? 'grabbing' : 'grab',
            borderRadius: 0.5,
            zIndex: 1,
            '&:active': { cursor: 'grabbing' },
          }}
        />

        {/* Left resize handle */}
        <Box
          onPointerDown={(e) => beginDrag('resize-left', e)}
          sx={{
            position: 'absolute',
            top: 2,
            bottom: 2,
            left: `calc(${leftPct}% - 7px)`,
            width: 14,
            zIndex: 2,
            cursor: 'ew-resize',
            borderRadius: 0.5,
            bgcolor: 'primary.dark',
            opacity: 0.85,
            boxShadow: 1,
          }}
        />

        {/* Right resize handle */}
        <Box
          onPointerDown={(e) => beginDrag('resize-right', e)}
          sx={{
            position: 'absolute',
            top: 2,
            bottom: 2,
            left: `calc(${leftPct + widthPct}% - 7px)`,
            width: 14,
            zIndex: 2,
            cursor: 'ew-resize',
            borderRadius: 0.5,
            bgcolor: 'primary.dark',
            opacity: 0.85,
            boxShadow: 1,
          }}
        />
      </Box>

      <Stack direction="row" justifyContent="space-between" sx={{ px: 0.25 }}>
        <Typography variant="caption" color="text.secondary">
          {formatRangeLabel(rangeStart)}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {formatRangeLabel(rangeEnd)}
        </Typography>
      </Stack>
    </Stack>
  );
}
