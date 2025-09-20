import React, { useState } from 'react';
import { COLORS } from '../../theme';
import { Button } from '../../components/ui/Button';

export type StockRow = {
  product: string;
  onHand: number;
  freeToUse: number;
  incoming: number;
  outgoing: number;
  totalValue: number;
  category?: string;
};

const mockStock: StockRow[] = [
  { product: 'Dining Table', onHand: 500, freeToUse: 270, incoming: 0, outgoing: 230, totalValue: 600000 },
  { product: 'Drawer', onHand: 20, freeToUse: 20, incoming: 0, outgoing: 0, totalValue: 2000 },
  { product: 'Screws', onHand: 8, freeToUse: 8, incoming: 100, outgoing: 0, totalValue: 500 },
  { product: 'Glue', onHand: 2, freeToUse: 2, incoming: 10, outgoing: 0, totalValue: 200 },
];

export const StockTable: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const handleReorder = (product: string) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div style={{ background: COLORS.background.white, borderRadius: 10, padding: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', color: COLORS.background.steel }}>
            <th style={{ padding: 8 }}>Product</th>
            <th style={{ padding: 8 }}>On Hand</th>
            <th style={{ padding: 8 }}>Free to Use</th>
            <th style={{ padding: 8 }}>Incoming</th>
            <th style={{ padding: 8 }}>Outgoing</th>
            <th style={{ padding: 8 }}>Total Value</th>
            <th style={{ padding: 8 }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {mockStock.map((row) => (
            <tr key={row.product} style={{ borderTop: '1px solid #EEE', background: row.onHand <= 10 ? COLORS.priority.urgent + '22' : 'inherit' }}>
              <td style={{ padding: 8 }}>{row.product}</td>
              <td style={{ padding: 8, color: row.onHand <= 10 ? COLORS.priority.urgent : 'inherit', fontWeight: row.onHand <= 10 ? 700 : 400 }}>{row.onHand}</td>
              <td style={{ padding: 8 }}>{row.freeToUse}</td>
              <td style={{ padding: 8 }}>{row.incoming}</td>
              <td style={{ padding: 8 }}>{row.outgoing}</td>
              <td style={{ padding: 8 }}>{row.totalValue}</td>
              <td style={{ padding: 8 }}>
                {row.onHand <= 10 && (
                  <Button variant="primary" size="sm" onClick={() => handleReorder(row.product)}>
                    Reorder
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {modalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: COLORS.background.white, borderRadius: 10, padding: 24, minWidth: 320, boxShadow: '0 2px 16px rgba(0,0,0,0.12)' }}>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>Create Purchase Order</div>
            <div style={{ marginBottom: 16 }}>Product: <strong>{selectedProduct}</strong></div>
            <div style={{ marginBottom: 16 }}>This is a mock modal. Implement PO creation logic here.</div>
            <Button variant="primary" onClick={closeModal}>Close</Button>
          </div>
        </div>
      )}
    </div>
  );
};
