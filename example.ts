import { combine, oneOf, range, someOf } from './src/builders';
import { build, template } from './src/core';

const GotoUrl = combine(
  {
    domain: 'https://faketastic.goto.de/meeting',
    id: range(100000000, 999999999),
  },
  v => `${v.domain}/${v.id}`,
);
const DocumentUrl = combine(
  {
    domain: 'https://fake.office.de/documents/',
    fileName: oneOf(['agenda.docx', 'offer.xslx', 'contract-draft.rft']),
  },
  v => `${v.domain}/${v.fileName}`,
);
const TrackingApiCall = combine(
  {
    domain: 'https://fake-api.centigrade.de/trackings/',
    action: oneOf(['start', 'pause']),
    trackingId: range(10000, 99999),
  },
  v => `${v.domain}/${v.action}/${v.trackingId}`,
);

const UrlTypes = [GotoUrl, DocumentUrl, TrackingApiCall];

const MyTemplate = template({
  url: someOf(UrlTypes),
});

const output = build(MyTemplate);
console.log(output);
