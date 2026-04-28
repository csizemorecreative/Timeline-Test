/** Point fields used by Highcharts timeline series + datetime x */
export interface TimelineEventPoint {
  x: number;
  name: string;
  label: string;
  description: string;
}

export const timelineEvents: TimelineEventPoint[] = [
  {
    x: Date.UTC(1945, 11, 31),
    name: 'December 31, 1945',
    label: 'African Americans in WWII',
    description:
      'Of the 2.5 million African American men who register for the draft from September 1, 1939 through December 31, 1945, more than one million, along with thousands of African American women, serve with distinction in World War II in all branches of service and in all Theaters of Operation.',
  },
  {
    x: Date.UTC(1946, 1, 12),
    name: 'February 12, 1946',
    label: 'The blinding of Isaac Woodard',
    description:
      'Isaac Woodard, an African American WWII veteran, is brutally attacked and blinded hours after being honorably discharged. When Truman learns of this atrocity, and others, he vows, “I shall fight to end evils like this.”',
  },
  {
    x: Date.UTC(1946, 11, 5),
    name: 'December 5, 1946',
    label: 'Executive Order 9808',
    description:
      'Truman issues Executive Order 9808 creating a first-of-its-kind Committee on Civil Rights to propose measures to strengthen and protect the civil rights of the American people.',
  },
  {
    x: Date.UTC(1947, 5, 29),
    name: 'June 29, 1947',
    label: 'Truman addresses the NAACP',
    description:
      'Truman becomes the first president to address the National Association for the Advancement of Colored People, also marking the first time a president addresses a civil rights organization. He delivers the strongest statements heard on civil rights since Abraham Lincoln.',
  },
  {
    x: Date.UTC(1947, 9, 29),
    name: 'October 29, 1947',
    label: '“To Secure These Rights”',
    description:
      'The President’s Committee on Civil Rights issues their landmark report, To Secure These Rights. The Committee calls for equal voting rights, the creation of a Civil Rights Division of the Justice Department to combat lynching and other assaults on Black lives and freedoms, equal employment, and fair housing laws.',
  },
  {
    x: Date.UTC(1948, 1, 2),
    name: 'February 2, 1948',
    label: 'First comprehensive civil rights message to Congress',
    description:
      'President Truman calls for a series of legislative proposals based on the findings in To Secure These Rights in the first-ever comprehensive presidential message on civil rights delivered to Congress.',
  },
  {
    x: Date.UTC(1948, 6, 26),
    name: 'July 26, 1948',
    label: 'Executive Orders 9981 & 9980',
    description:
      'Truman signs Executive Order 9981, which desegregates the U.S. Armed Forces, and Executive Order 9980, which prohibits race-based employment discrimination in the federal government.',
  },
  {
    x: Date.UTC(1948, 9, 29),
    name: 'October 29, 1948',
    label: 'Truman campaigns in Harlem',
    description:
      'In the last days of the presidential election, Truman makes a campaign appearance in Harlem. It is the first time a U.S. president visits the symbolic capital of Black America.',
  },
  {
    x: Date.UTC(1949, 0, 12),
    name: 'January 12, 1949',
    label: 'Fahy Committee meeting',
    description:
      'In the Fahy Committee’s first meeting with President Truman and the Secretaries of the Army, Navy, Air Force, and Defense, Truman says, “I want concrete results—that’s what I’m after—not publicity on it.” The Committee takes him literally, not only investigating conditions but also working quietly and diligently with the Army, Navy, and Air Force to bring about desired changes.',
  },
  {
    x: Date.UTC(1950, 4, 22),
    name: 'May 22, 1950',
    label: '“Freedom to Serve”',
    description:
      'The President’s Committee on Equality of Treatment and Opportunity in the Armed Services (Fahy Committee), established as part of Executive Order 9981, submits its final report, Freedom to Serve.',
  },
  {
    x: Date.UTC(1954, 4, 17),
    name: 'May 17, 1954',
    label: 'Brown v. Board of Education',
    description:
      'The enactment of Executive Order 9981 paves the way for the Civil Rights Movement, including the desegregation of public schools. In Brown vs. Board of Education, the Supreme Court reviewed a briefing about the successful integration of military units before declaring that racial segregation in public schools is unconstitutional, noting there had been no loss of efficiency and outstanding morale in integrated units.',
  },
  {
    x: Date.UTC(1954, 9, 30),
    name: 'October 30, 1954',
    label: 'Full Armed Forces integration',
    description:
      'The Armed Services announces integration of all of its branches after some branches resisted and delayed implementation of E.O. 9981.',
  },
];
