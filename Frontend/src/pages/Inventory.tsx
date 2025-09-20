import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';
import { COLORS } from '../theme';

interface StockItem {
  id: string;
  productName: string;
  sku: string;
  workCenter: string;
  quantity: number;
  reservedQty: number;
  availableQty: number;
  minQty: number;
  maxQty: number;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  lastUpdated: string;
}

const sampleStockItems: StockItem[] = [
  {
    id: '1',
    productName: 'Steel Rod 10mm',
    sku: 'SR-10-001',
    workCenter: 'Raw Materials',
    quantity: 150,
    reservedQty: 25,
    availableQty: 125,
    minQty: 50,
    maxQty: 500,
    status: 'IN_STOCK',
    lastUpdated: '2025-01-15'
  },
  {
    id: '2',
    productName: 'Aluminum Sheet 2mm',
    sku: 'AS-2-002',
    workCenter: 'Raw Materials',
    quantity: 30,
    reservedQty: 5,
    availableQty: 25,
    minQty: 50,
    maxQty: 200,
    status: 'LOW_STOCK',
    lastUpdated: '2025-01-14'
  },
  {
    id: '3',
    productName: 'Bolt M8x20',
    sku: 'B-M8-20-003',
    workCenter: 'Hardware',
    quantity: 0,
    reservedQty: 0,
    availableQty: 0,
    minQty: 100,
    maxQty: 1000,
    status: 'OUT_OF_STOCK',
    lastUpdated: '2025-01-10'
  }
];

export const Inventory: React.FC = () => {
  const [stockItems] = useState<StockItem[]>(sampleStockItems);
  const [filter, setFilter] = useState<'ALL' | 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK'>('ALL');

  const getStatusColor = (status: StockItem['status']) => {
    switch (status) {
      case 'IN_STOCK': return COLORS.status.success;
      case 'LOW_STOCK': return COLORS.priority.medium;
      case 'OUT_OF_STOCK': return COLORS.priority.urgent;
      default: return COLORS.background.steel;
    }
  };

  const getStatusText = (status: StockItem['status']) => {
    switch (status) {
      case 'IN_STOCK': return 'In Stock';
      case 'LOW_STOCK': return 'Low Stock';
      case 'OUT_OF_STOCK': return 'Out of Stock';
      default: return status;
    }
  };

  const filteredItems = stockItems.filter(item => 
    filter === 'ALL' || item.status === filter
  );

  const totalItems = stockItems.length;
  const inStockItems = stockItems.filter(item => item.status === 'IN_STOCK').length;
  const lowStockItems = stockItems.filter(item => item.status === 'LOW_STOCK').length;
  const outOfStockItems = stockItems.filter(item => item.status === 'OUT_OF_STOCK').length;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: COLORS.background.lightGray }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Topbar />
        <main style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: COLORS.primary.navy, margin: 0 }}>
              Inventory Management
            </h1>
            <div style={{ display: 'flex', gap: 12 }}>
              <button style={{
                background: COLORS.secondary.teal,
                color: 'white',
                border: 'none',
                borderRadius: 8,
                padding: '12px 24px',
                fontSize: 16,
                fontWeight: 600,
                cursor: 'pointer'
              }}>
                Add Stock
              </button>
              <button style={{
                background: COLORS.primary.blue,
                color: 'white',
                border: 'none',
                borderRadius: 8,
                padding: '12px 24px',
                fontSize: 16,
                fontWeight: 600,
                cursor: 'pointer'
              }}>
                Stock Movement
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
            <div style={{
              background: COLORS.background.white,
              padding: 20,
              borderRadius: 10,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: COLORS.primary.blue, marginBottom: 8 }}>
                {totalItems}
              </div>
              <div style={{ color: COLORS.background.steel, fontSize: 14, fontWeight: 600 }}>
                Total Items
              </div>
            </div>
            <div style={{
              background: COLORS.background.white,
              padding: 20,
              borderRadius: 10,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: COLORS.status.success, marginBottom: 8 }}>
                {inStockItems}
              </div>
              <div style={{ color: COLORS.background.steel, fontSize: 14, fontWeight: 600 }}>
                In Stock
              </div>
            </div>
            <div style={{
              background: COLORS.background.white,
              padding: 20,
              borderRadius: 10,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: COLORS.priority.medium, marginBottom: 8 }}>
                {lowStockItems}
              </div>
              <div style={{ color: COLORS.background.steel, fontSize: 14, fontWeight: 600 }}>
                Low Stock
              </div>
            </div>
            <div style={{
              background: COLORS.background.white,
              padding: 20,
              borderRadius: 10,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: COLORS.priority.urgent, marginBottom: 8 }}>
                {outOfStockItems}
              </div>
              <div style={{ color: COLORS.background.steel, fontSize: 14, fontWeight: 600 }}>
                Out of Stock
              </div>
            </div>
          </div>

          {/* Filters */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', gap: 12 }}>
              {['ALL', 'IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status as any)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 20,
                    border: 'none',
                    background: filter === status ? COLORS.primary.blue : COLORS.background.white,
                    color: filter === status ? 'white' : COLORS.background.steel,
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: 14
                  }}
                >
                  {status.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Inventory Table */}
          <div style={{ background: COLORS.background.white, borderRadius: 10, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #E5E7EB' }}>
                  <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 600, color: COLORS.background.steel }}>Product</th>
                  <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 600, color: COLORS.background.steel }}>SKU</th>
                  <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 600, color: COLORS.background.steel }}>Work Center</th>
                  <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 600, color: COLORS.background.steel }}>Quantity</th>
                  <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 600, color: COLORS.background.steel }}>Available</th>
                  <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 600, color: COLORS.background.steel }}>Status</th>
                  <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 600, color: COLORS.background.steel }}>Last Updated</th>
                  <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 600, color: COLORS.background.steel }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '16px 12px', fontWeight: 600, color: COLORS.primary.navy }}>
                      {item.productName}
                    </td>
                    <td style={{ padding: '16px 12px', fontFamily: 'monospace', fontSize: 14 }}>
                      {item.sku}
                    </td>
                    <td style={{ padding: '16px 12px' }}>{item.workCenter}</td>
                    <td style={{ padding: '16px 12px' }}>
                      <div style={{ fontWeight: 600 }}>{item.quantity}</div>
                      <div style={{ fontSize: 12, color: COLORS.background.steel }}>
                        Reserved: {item.reservedQty}
                      </div>
                    </td>
                    <td style={{ padding: '16px 12px', fontWeight: 600, color: COLORS.primary.blue }}>
                      {item.availableQty}
                    </td>
                    <td style={{ padding: '16px 12px' }}>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: 20,
                        background: getStatusColor(item.status),
                        color: 'white',
                        fontSize: 12,
                        fontWeight: 600
                      }}>
                        {getStatusText(item.status)}
                      </span>
                    </td>
                    <td style={{ padding: '16px 12px', fontSize: 14 }}>
                      {item.lastUpdated}
                    </td>
                    <td style={{ padding: '16px 12px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button style={{
                          padding: '6px 12px',
                          background: COLORS.primary.blue,
                          color: 'white',
                          border: 'none',
                          borderRadius: 6,
                          fontSize: 12,
                          cursor: 'pointer'
                        }}>
                          View
                        </button>
                        <button style={{
                          padding: '6px 12px',
                          background: COLORS.secondary.teal,
                          color: 'white',
                          border: 'none',
                          borderRadius: 6,
                          fontSize: 12,
                          cursor: 'pointer'
                        }}>
                          Adjust
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};
