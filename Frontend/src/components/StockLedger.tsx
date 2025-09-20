import React from 'react';
import { COLORS } from '../theme';

export type StockItem = {
  product: string;
  unitCost: number;
  unit: string;
  totalValue: number;
  onHand: number;
  freeToUse: number;
  incoming: number;
  outgoing: number;
};

interface StockLedgerProps {
  data: StockItem[];
  lowStockThreshold?: number;
}

export const StockLedger: React.FC<StockLedgerProps> = ({ data, lowStockThreshold = 10 }) => {
  return (
    <div style={{ background: COLORS.background.white, borderRadius: 10, padding: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', color: COLORS.background.steel }}>
            <th style={{ padding: 8 }}>Product</th>
            <th style={{ padding: 8 }}>Unit Cost</th>
            <th style={{ padding: 8 }}>Unit</th>
            <th style={{ padding: 8 }}>Total Value</th>
            <th style={{ padding: 8 }}>On Hand</th>
            <th style={{ padding: 8 }}>Free to Use</th>
            <th style={{ padding: 8 }}>Incoming</th>
            <th style={{ padding: 8 }}>Outgoing</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => {
            const low = d.onHand <= lowStockThreshold;
            return (
              <tr key={d.product} style={{ borderTop: '1px solid #EEE' }}>
                <td style={{ padding: 8 }}>{d.product}</td>
                <td style={{ padding: 8 }}>{d.unitCost}</td>
                <td style={{ padding: 8 }}>{d.unit}</td>
                <td style={{ padding: 8 }}>{d.totalValue}</td>
                <td style={{ padding: 8, color: low ? COLORS.priority.urgent : 'inherit', fontWeight: low ? 700 : 400 }}>{d.onHand}</td>
                <td style={{ padding: 8 }}>{d.freeToUse}</td>
                <td style={{ padding: 8, color: COLORS.primary.blue }}>{d.incoming}</td>
                <td style={{ padding: 8, color: COLORS.secondary.amber }}>{d.outgoing}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
