import React from 'react';
import PageShell from './PageShell';
import CaseStudyBody from '../CaseStudyBody';

/** Dedicated case study — reached from a project page via "Read case study". */
const CaseStudyPage = ({ project }) => {
  if (!project || !project.caseStudy) return null;
  return (
    // wider than PageShell's 880 default — the image pairs and the Figma
    // embed inside CaseStudyBody use up to 960px so screenshots stay legible
    // on a laptop screen; the prose column itself still holds at 680
    <PageShell title={project.title} eyebrow="Case study" maxWidth={1040}>
      <CaseStudyBody project={project} />
    </PageShell>
  );
};

export default CaseStudyPage;
