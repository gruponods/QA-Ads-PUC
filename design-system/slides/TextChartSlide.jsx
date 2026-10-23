import React from 'react';
import { SlideFrame } from './SlideFrame.jsx';
import { SlideFooter } from './SlideFooter.jsx';
import { SlideHeading } from './SlideHeading.jsx';
import { BarChart } from '../components/data/BarChart.jsx';
import { BigNumber } from '../components/data/BigNumber.jsx';
import { StatDelta } from '../components/data/StatDelta.jsx';

/** Text + chart: short text blocks carry the takeaway, the themed chart carries the data. */
export function TextChartSlide({
  kicker = 'Adopción', title = 'Cada año, más aulas', highlight = 'eligen NODS',
  data = [{ label: '2021', value: 41 }, { label: '2022', value: 58 }, { label: '2023', value: 69 }, { label: '2024', value: 76, color: 'var(--data-up)' }],
  page = '04', ...props
}) {
  return (
    <SlideFrame {...props}>
      <SlideHeading kicker={kicker} title={title} highlight={highlight} />
      <div style={{ flex: 1, display: 'flex', gap: '64px', alignItems: 'center', marginTop: '32px' }}>
        <div style={{ flex: '0 0 36%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <BigNumber value="76" suffix="%" size="inline" delta={<StatDelta value="18 pts" direction="up" />}
            label="de las aulas activas continúan al trimestre siguiente." />
          <p style={{ margin: 0, borderTop: 'var(--border-hairline)', paddingTop: '20px', fontSize: '15px', lineHeight: 'var(--lh-body)', color: 'var(--text-muted)' }}>
            Retención medida sobre aulas con más de 20 estudiantes en cuatro cohortes anuales consecutivas.
          </p>
        </div>
        <div style={{ flex: 1 }}>
          <BarChart unit="%" height={300} data={data} />
        </div>
      </div>
      <SlideFooter page={page} label="Adopción" />
    </SlideFrame>
  );
}
