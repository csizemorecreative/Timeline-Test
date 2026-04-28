import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import FitScreenIcon from '@mui/icons-material/FitScreen';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import HighchartsReact from 'highcharts-react-official';
import type { AxisSetExtremesEventObject, Options } from 'highcharts';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  centerRangeOnMarker,
  clampTimelineRange,
  getTimelineDomain,
  TIMELINE_MIN_SPAN_MS,
} from '../data/timelineExtent';
import Highcharts from '../highchartsSetup';
import { timelineEvents } from '../data/timelineEvents';
import { TIMELINE_PLACEHOLDER_IMAGE } from '../timelinePlaceholderAsset';

import { TimelineRangeScrubber } from './TimelineRangeScrubber';
import { TimelineSlideshowDialog } from './TimelineSlideshowDialog';

const DOMAIN = getTimelineDomain();
const N = timelineEvents.length;

/** Solid marker / connector color (timeline points use one hue). */
const TIMELINE_MARKER_BLUE = '#2e75b6';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function CivilRightsTimelineChart() {
  const [range, setRange] = useState<[number, number]>(() => [
    DOMAIN.min,
    DOMAIN.max,
  ]);
  const [focusedMarkerIndex, setFocusedMarkerIndex] = useState<number | null>(
    null,
  );
  const [slideshowOpen, setSlideshowOpen] = useState(false);
  const [slideshowIndex, setSlideshowIndex] = useState(0);

  const syncingFromScrubber = useRef(false);
  const rangeSpanRef = useRef(range[1] - range[0]);

  useEffect(() => {
    rangeSpanRef.current = range[1] - range[0];
  }, [range]);

  const openSlideshow = useCallback((index: number) => {
    setSlideshowIndex(index);
    setSlideshowOpen(true);
    setFocusedMarkerIndex(index);
  }, []);

  const slideshowOpenerRef = useRef(openSlideshow);
  slideshowOpenerRef.current = openSlideshow;

  useEffect(() => {
    if (focusedMarkerIndex === null) return;
    const span = rangeSpanRef.current;
    const ev = timelineEvents[focusedMarkerIndex];
    const next = centerRangeOnMarker(ev.x, span, DOMAIN);
    syncingFromScrubber.current = true;
    setRange(next);
    window.setTimeout(() => {
      syncingFromScrubber.current = false;
    }, 120);
  }, [focusedMarkerIndex]);

  const handleAfterSetExtremes = useCallback(
    (e: AxisSetExtremesEventObject) => {
      if (syncingFromScrubber.current) return;
      if (e.min == null || e.max == null) return;
      const next = clampTimelineRange(e.min, e.max, DOMAIN);
      setRange((prev) => {
        if (
          Math.abs(prev[0] - next[0]) < 2 &&
          Math.abs(prev[1] - next[1]) < 2
        ) {
          return prev;
        }
        return next;
      });
    },
    [],
  );

  const handleScrubberRange = useCallback((start: number, end: number) => {
    const next = clampTimelineRange(start, end, DOMAIN);
    syncingFromScrubber.current = true;
    setRange(next);
    window.setTimeout(() => {
      syncingFromScrubber.current = false;
    }, 120);
  }, []);

  const handleResetRange = useCallback(() => {
    syncingFromScrubber.current = true;
    setRange([DOMAIN.min, DOMAIN.max]);
    window.setTimeout(() => {
      syncingFromScrubber.current = false;
    }, 120);
  }, []);

  const handleMarkerPrev = useCallback(() => {
    setFocusedMarkerIndex((prev) => {
      if (prev === null) return N - 1;
      return Math.max(0, prev - 1);
    });
  }, []);

  const handleMarkerNext = useCallback(() => {
    setFocusedMarkerIndex((prev) => {
      if (prev === null) return 0;
      return Math.min(N - 1, prev + 1);
    });
  }, []);

  const prevDisabled =
    focusedMarkerIndex !== null && focusedMarkerIndex === 0;
  const nextDisabled =
    focusedMarkerIndex !== null && focusedMarkerIndex === N - 1;

  const handleSlideshowIndexChange = useCallback((index: number) => {
    setSlideshowIndex(index);
    setFocusedMarkerIndex(index);
  }, []);

  const chartOptions: Options = useMemo(
    () => ({
      chart: {
        type: 'timeline',
        height: 720,
        zooming: { type: 'x' },
        panning: { enabled: true, type: 'x' },
        panKey: 'shift',
        scrollablePlotArea: {
          minWidth: 1100,
          scrollPositionX: 0,
        },
        animation: false,
      },
      title: {
        text: 'Civil rights milestones (1945–1954)',
      },
      subtitle: {
        text:
          'Calendar axis. Drag on the chart to zoom; use the scrubber above to set the window. Click an event to open details.',
      },
      plotOptions: {
        timeline: {
          colorByPoint: false,
          point: {
            events: {
              click: function () {
                const idx = this.index;
                if (typeof idx === 'number') {
                  slideshowOpenerRef.current(idx);
                }
              },
            },
          },
        },
      },
      xAxis: {
        type: 'datetime',
        min: range[0],
        max: range[1],
        visible: true,
        minRange: TIMELINE_MIN_SPAN_MS,
        labels: {
          format: '{value:%b %Y}',
        },
        title: { text: undefined },
        events: {
          afterSetExtremes: handleAfterSetExtremes,
        },
      },
      yAxis: {
        visible: false,
      },
      tooltip: {
        enabled: false,
      },
      colors: [TIMELINE_MARKER_BLUE],
      series: [
        {
          type: 'timeline',
          color: TIMELINE_MARKER_BLUE,
          cursor: 'pointer',
          dataLabels: {
            allowOverlap: false,
            alternate: true,
            useHTML: true,
            formatter: function () {
              const pt = this as Highcharts.Point;
              const opts = pt.options as { label?: string; name?: string };
              const label = escapeHtml(String(opts.label ?? ''));
              const name = escapeHtml(String(opts.name ?? pt.name ?? ''));
              const src = TIMELINE_PLACEHOLDER_IMAGE;
              return (
                '<div style="display:flex;align-items:flex-start;gap:8px;">' +
                `<img src="${src}" width="28" height="28" alt="" style="border-radius:4px;flex-shrink:0;object-fit:cover;" />` +
                '<span style="text-align:left;">' +
                `<span style="font-weight:bold;font-size:12px;display:block;color:#333333;">${label}</span>` +
                `<span style="font-weight:normal;font-size:0.8em;opacity:0.9;color:#333333;">${name}</span>` +
                '</span></div>'
              );
            },
          },
          marker: {
            symbol: 'circle',
          },
          data: timelineEvents,
        },
      ],
      credits: {
        text: 'Highcharts',
        href: 'https://www.highcharts.com/',
      },
    }),
    [range, handleAfterSetExtremes],
  );

  return (
    <Paper
      elevation={1}
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <Stack spacing={0}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={{ xs: 0.5, sm: 1 }}
          sx={{ px: { xs: 1, sm: 2 }, pt: 2 }}
        >
          <Tooltip title="Previous marker">
            <span>
              <IconButton
                aria-label="Previous timeline marker"
                onClick={handleMarkerPrev}
                disabled={prevDisabled}
                size="medium"
              >
                <ChevronLeft />
              </IconButton>
            </span>
          </Tooltip>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <TimelineRangeScrubber
              domainMin={DOMAIN.min}
              domainMax={DOMAIN.max}
              rangeStart={range[0]}
              rangeEnd={range[1]}
              onRangeChange={handleScrubberRange}
            />
          </Box>

          <Tooltip title="Next marker">
            <span>
              <IconButton
                aria-label="Next timeline marker"
                onClick={handleMarkerNext}
                disabled={nextDisabled}
                size="medium"
              >
                <ChevronRight />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title="Show full timeline">
            <IconButton
              aria-label="Reset visible range to full timeline"
              onClick={handleResetRange}
              size="medium"
            >
              <FitScreenIcon />
            </IconButton>
          </Tooltip>
        </Stack>

        <Box
          sx={{
            width: '100%',
            minHeight: { xs: 640, sm: 720 },
            '& > div': { height: '100%', minHeight: { xs: 640, sm: 720 } },
          }}
        >
          <HighchartsReact
            highcharts={Highcharts}
            options={chartOptions}
            containerProps={{
              style: { width: '100%', height: '100%', minHeight: 640 },
            }}
          />
        </Box>
      </Stack>

      <TimelineSlideshowDialog
        open={slideshowOpen}
        onClose={() => setSlideshowOpen(false)}
        events={timelineEvents}
        index={slideshowIndex}
        onIndexChange={handleSlideshowIndexChange}
      />
    </Paper>
  );
}
