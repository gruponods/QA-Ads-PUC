import React from 'react';

/**
 * Pivot table: one row per entity, column groups (e.g. ISO weeks) × measures (e.g. CPL, Leads).
 * Sticky first column, zebra rows, hairline between groups, bold total footer.
 * rows: [{ id, label, cells: { [groupKey]: { [measureKey]: value } } }]
 */
export function PivotTable({ rowLabel = '', rows = [], groups = [], measures = [], total, variant = 'striped', firstColWidth = 320, style = {}, ...rest }) {
  const th = { padding: '11px 14px', fontSize: '12px', fontWeight: 'var(--fw-medium)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-faint)', background: 'var(--gray-050)', whiteSpace: 'nowrap' };
  const td = { padding: '11px 14px', fontSize: '14px', color: 'var(--text)', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums', verticalAlign: 'middle' };
  const sticky = { position: 'sticky', left: 0, zIndex: 1, borderRight: 'var(--border-hairline)' };
  const rowBg = (i) => (variant === 'striped' && i % 2 === 1 ? 'linear-gradient(var(--table-stripe), var(--table-stripe)) var(--surface)' : 'var(--surface)');
  const show = (m, v, r, g) => (m.render ? m.render(v, r, g) : v === null || v === undefined ? '–' : v);
  return (
    <div style={{ border: 'var(--border-hairline)', borderRadius: 'var(--radius-card)', overflow: 'hidden', background: 'var(--surface)', fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      <div style={{ overflowX: 'auto', overflowY: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
          <thead>
            <tr>
              <th rowSpan={2} style={{ ...th, ...sticky, zIndex: 2, minWidth: Math.min(220, firstColWidth), width: firstColWidth, textAlign: 'left', verticalAlign: 'bottom', borderBottom: 'var(--border-hairline)' }}>{rowLabel}</th>
              {groups.map((g) => (
                <th key={g.key} colSpan={measures.length} style={{ ...th, textAlign: 'center', borderLeft: 'var(--border-hairline)', borderBottom: 'var(--border-hairline)', fontSize: '14px', fontWeight: 'var(--fw-bold)', letterSpacing: 0, textTransform: 'none', color: g.highlight ? 'var(--accent)' : 'var(--text)' }}>
                  {g.label}
                  {g.sub && <span style={{ display: 'block', marginTop: '2px', fontSize: '11px', fontWeight: 'var(--fw-medium)', letterSpacing: '0.04em', textTransform: 'none', color: 'var(--text-faint)' }}>{g.sub}</span>}
                </th>
              ))}
            </tr>
            <tr>
              {groups.map((g) => measures.map((m, mi) => (
                <th key={g.key + m.key} style={{ ...th, textAlign: m.align || 'right', borderLeft: mi === 0 ? 'var(--border-hairline)' : 'none', borderBottom: 'var(--border-hairline)' }}>{m.label}</th>
              )))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id || i}>
                <td title={typeof r.label === 'string' ? r.label : undefined} style={{ ...td, ...sticky, background: rowBg(i), fontWeight: 'var(--fw-medium)', whiteSpace: 'normal', lineHeight: 1.35, minWidth: Math.min(220, firstColWidth), maxWidth: firstColWidth, borderTop: variant === 'lines' && i ? 'var(--border-hairline)' : 'none' }}>{r.label}</td>
                {groups.map((g) => measures.map((m, mi) => (
                  <td key={g.key + m.key} style={{ ...td, background: rowBg(i), textAlign: m.align || 'right', borderLeft: mi === 0 ? 'var(--border-hairline)' : 'none', borderTop: variant === 'lines' && i ? 'var(--border-hairline)' : 'none' }}>{show(m, r.cells?.[g.key]?.[m.key], r, g)}</td>
                )))}
              </tr>
            ))}
          </tbody>
          {total && (
            <tfoot>
              <tr>
                <td style={{ ...td, ...sticky, background: 'var(--gray-050)', fontWeight: 'var(--fw-bold)', borderTop: '1px solid var(--gray-300)' }}>{total.label || 'Total'}</td>
                {groups.map((g) => measures.map((m, mi) => {
                  const v = total.cells?.[g.key]?.[m.key];
                  return <td key={g.key + m.key} style={{ ...td, background: 'var(--gray-050)', fontWeight: 'var(--fw-bold)', textAlign: m.align || 'right', borderLeft: mi === 0 ? 'var(--border-hairline)' : 'none', borderTop: '1px solid var(--gray-300)' }}>{m.renderTotal ? m.renderTotal(v) : m.format ? m.format(v) : v}</td>;
                }))}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
