import React from 'react';

const ALERT = {
  risk: { bg: 'var(--data-down-soft)', icon: 'alert-circle', color: 'var(--data-down-fg)' },
  warn: { bg: 'var(--data-warn-soft)', icon: 'alert-triangle', color: 'var(--data-warn-fg)' },
  ok: { bg: 'var(--data-up-soft)', icon: 'circle-check', color: 'var(--data-up-fg)' },
  info: { bg: 'var(--accent-soft)', icon: 'info-circle', color: 'var(--accent)' },
};

/**
 * Flat data table with clearly distinguished rows.
 * variant: striped (default, zebra) · lines (hairline rows) · separated (each row its own rounded card).
 * rowTone(row) flags a row: tinted background + leading alert icon. Columns can be sortable.
 */
export function DataTable({ columns = [], rows = [], rowKey = 'id', onRowClick, variant = 'striped', dense = false, rowTone, empty = 'Sin resultados.', defaultSort, style = {}, ...rest }) {
  const [hov, setHov] = React.useState(null);
  const [sort, setSort] = React.useState(defaultSort || null);
  const pad = dense ? '10px 16px' : '14px 16px';
  const sep = variant === 'separated';
  const flagged = typeof rowTone === 'function';

  const sorted = React.useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col) return rows;
    const get = col.sortValue || ((r) => r[col.key]);
    return [...rows].sort((a, b) => {
      const x = get(a); const y = get(b);
      const r = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), 'es');
      return sort.dir === 'asc' ? r : -r;
    });
  }, [rows, sort, columns]);

  const toggleSort = (c) => {
    if (!c.sortable) return;
    setSort((s) => (s && s.key === c.key ? (s.dir === 'desc' ? { key: c.key, dir: 'asc' } : null) : { key: c.key, dir: 'desc' }));
  };

  const head = { padding: pad, fontSize: '12px', fontWeight: 'var(--fw-medium)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-faint)', whiteSpace: 'nowrap', textAlign: 'left' };
  const cols = flagged ? [{ key: '__flag', label: '', width: 44, __flag: true }, ...columns] : columns;

  const table = (
    <table style={{ width: '100%', borderCollapse: sep ? 'separate' : 'collapse', borderSpacing: sep ? '0 8px' : 0 }}>
      <thead>
        <tr>
          {cols.map((c) => {
            const active = sort && sort.key === c.key;
            return (
              <th key={c.key} onClick={() => toggleSort(c)} aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined}
                style={{ ...head, textAlign: c.align || 'left', width: c.width, background: sep ? 'transparent' : 'var(--gray-050)', borderBottom: sep ? 'none' : 'var(--border-hairline)', cursor: c.sortable ? 'pointer' : 'default', color: active ? 'var(--text)' : 'var(--text-faint)', padding: sep ? '4px 16px 0' : pad, userSelect: 'none' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  {c.label}
                  {c.sortable && <i className={`ti ti-${active ? (sort.dir === 'asc' ? 'sort-ascending' : 'sort-descending') : 'arrows-sort'}`} style={{ fontSize: '14px', color: active ? 'var(--accent)' : 'var(--gray-300)' }} />}
                </span>
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {sorted.length === 0 && (
          <tr><td colSpan={cols.length} style={{ padding: '32px 16px', textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>{empty}</td></tr>
        )}
        {sorted.map((r, i) => {
          const k = r[rowKey] !== undefined ? r[rowKey] : i;
          const tone = flagged ? rowTone(r) : null;
          const a = tone && ALERT[tone];
          const isHov = onRowClick && hov === k;
          const bg = isHov ? 'var(--table-hover)' : a ? a.bg : variant === 'striped' && i % 2 === 1 ? 'var(--table-stripe)' : 'var(--surface)';
          return (
            <tr key={k} onClick={onRowClick ? () => onRowClick(r) : undefined} onMouseEnter={() => setHov(k)} onMouseLeave={() => setHov(null)}
              style={{ cursor: onRowClick ? 'pointer' : 'default' }}>
              {cols.map((c, j) => {
                const first = j === 0; const last = j === cols.length - 1;
                const cell = {
                  textAlign: c.align || 'left', padding: pad, fontSize: '14px', color: 'var(--text)', verticalAlign: 'middle', background: bg, transition: 'background .15s ease',
                  borderTop: sep ? 'var(--border-hairline)' : variant === 'lines' && i > 0 ? 'var(--border-hairline)' : 'none',
                  borderBottom: sep ? 'var(--border-hairline)' : 'none',
                  borderLeft: sep && first ? 'var(--border-hairline)' : 'none',
                  borderRight: sep && last ? 'var(--border-hairline)' : 'none',
                  borderRadius: sep ? (first ? '12px 0 0 12px' : last ? '0 12px 12px 0' : 0) : 0,
                };
                if (c.__flag) {
                  return <td key={c.key} style={{ ...cell, paddingRight: 0, width: 44 }}>{a && <i className={`ti ti-${a.icon}`} title={tone} style={{ fontSize: '20px', color: a.color, display: 'block' }} />}</td>;
                }
                return <td key={c.key} style={cell}>{c.render ? c.render(r) : r[c.key]}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  if (sep) return <div style={{ fontFamily: 'var(--font-sans)', overflowX: 'auto', margin: '-8px 0', ...style }} {...rest}>{table}</div>;
  return (
    <div style={{ border: 'var(--border-hairline)', borderRadius: 'var(--radius-card)', overflow: 'hidden', background: 'var(--surface)', fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      <div style={{ overflowX: 'auto' }}>{table}</div>
    </div>
  );
}
