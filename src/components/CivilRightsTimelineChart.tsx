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

import { TimelineMarkerFocusPanel } from './TimelineMarkerFocusPanel';
import { TimelineRangeScrubber } from './TimelineRangeScrubber';
import { TimelineSlideshowDialog } from './TimelineSlideshowDialog';

const DOMAIN = getTimelineDomain();
const N = timelineEvents.length;

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
        outside: true,
        headerFormat:
          '<span style="font-size: 0.85em">{point.point.name}</span><br/>',
        pointFormat:
          '<b>{point.label}</b><br/><span style="opacity:0.95">{point.description}</span>',
      },
      colors: [
        '#1f4e79',
        '#2e75b6',
        '#5b9bd5',
        '#9dc3e6',
        '#4472c4',
        '#548235',
        '#70ad47',
        '#a9d18e',
        '#ed7d31',
        '#f4b183',
        '#7030a0',
        '#c55a11',
      ],
      series: [
        {
          type: 'timeline',
          cursor: 'pointer',
          dataLabels: {
            allowOverlap: false,
            alternate: true,
            format:
              '<span style="font-weight: bold; font-size: 12px">{point.label}</span><br><span style="font-weight: normal; opacity: 0.9">{point.name}</span>',
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

  const focusedEvent =
    focusedMarkerIndex !== null ? timelineEvents[focusedMarkerIndex] : null;

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

        <TimelineMarkerFocusPanel
          event={focusedEvent}
          onClear={() => setFocusedMarkerIndex(null)}
        />

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
