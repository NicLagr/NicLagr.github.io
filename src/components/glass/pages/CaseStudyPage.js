import React from 'react';
import PageShell from './PageShell';
import CaseStudyBody from '../CaseStudyBody';

/** Dedicated case study — reached from a project page via "Read case study". */
const CaseStudyPage = ({ project }) => {
  if (!project || !project.caseStudy) return null;
  return (
    <PageShell title={project.title} eyebrow="Case study">
      <CaseStudyBody project={project} />
    </PageShell>
  );
};

export default CaseStudyPage;
