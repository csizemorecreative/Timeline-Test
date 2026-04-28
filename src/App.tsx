import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import { ContentDMSiteChrome } from './components/ContentDMSiteChrome';
import { CivilRightsTimelineChart } from './components/CivilRightsTimelineChart';

export default function App() {
  return (
    <ContentDMSiteChrome>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Stack spacing={2}>
          <div>
            <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
              Truman Era Civil Rights Timeline
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '60ch' }}>
              Key moments from World War II through the integration of the Armed Forces. Use the
              scrubber to zoom and pan the window; arrows step between events; click an event for a
              full-screen read-through with arrow keys.
            </Typography>
          </div>
          <CivilRightsTimelineChart />
        </Stack>
      </Container>
    </ContentDMSiteChrome>
  );
}
