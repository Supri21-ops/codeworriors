import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { COLORS } from '../theme';
import { inventoryService, StockItem, InventoryResponse } from '../services/inventory.service';
import { toast } from 'react-hot-toast';

export const Inventory: React.FC = () => {
  const [inventoryData, setInventoryData] = useState<InventoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK'>('ALL');

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        const data = await inventoryService.getInventory({ limit: 50 });
        setInventoryData(data);
      } catch (error) {
        console.error('Failed to fetch inventory:', error);
        toast.error('Failed to load inventory data');
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

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

  const handleViewItem = (id: string) => {
    toast(`Viewing item ${id} - Feature coming soon`);
  };

  const handleAdjustStock = async (id: string) => {
    try {
      const quantity = prompt('Enter adjustment quantity (positive to add, negative to remove):');
      const reason = prompt('Enter reason for adjustment:');
      
      if (quantity && reason) {
        await inventoryService.adjustStock(id, { 
          quantity: parseInt(quantity), 
          reason 
        });
        
        // Refresh data
        const data = await inventoryService.getInventory({ limit: 50 });
        setInventoryData(data);
        toast.success('Stock adjusted successfully');
      }
    } catch (error) {
      console.error('Failed to adjust stock:', error);
      toast.error('Failed to adjust stock');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading inventory...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!inventoryData) {
    return (
      <DashboardLayout>
        <div style={{ 
          padding: '20px', 
          background: '#FEE2E2', 
          color: '#B91C1C',
          borderRadius: '8px',
          textAlign: 'center' 
        }}>
          Failed to load inventory data
        </div>
      </DashboardLayout>
    );
  }

  const stockItems = inventoryData.items;
  const summary = inventoryData.summary;
  
  const filteredItems = stockItems.filter((item: StockItem) => 
    filter === 'ALL' || item.status === filter
  );

  const totalItems = summary?.totalItems || 0;
  const inStockItems = summary?.inStockItems || 0;
  const lowStockItems = summary?.lowStockItems || 0;
  const outOfStockItems = summary?.outOfStockItems || 0;

  return (
    <DashboardLayout>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: COLORS.primary.navy, margin: 0 }}>
            Inventory Management
          </h1>
          <div style={{ display: 'flex', gap: 12 }}>
            <button 
              onClick={() => toast.success('Add Stock - Feature coming soon')}
              style={{
                background: COLORS.secondary.teal,
                color: 'white',
                border: 'none',
                borderRadius: 8,
                padding: '12px 24px',
                fontSize: 16,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Add Stock
            </button>
            <button 
              onClick={() => toast.success('Stock Movement - Feature coming soon')}
              style={{
                background: COLORS.primary.blue,
                color: 'white',
                border: 'none',
                borderRadius: 8,
                padding: '12px 24px',
                fontSize: 16,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
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
              {filteredItems.map((item: StockItem) => (
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
                      <button 
                        onClick={() => handleViewItem(item.id)}
                        style={{
                          padding: '6px 12px',
                          background: COLORS.primary.blue,
                          color: 'white',
                          border: 'none',
                          borderRadius: 6,
                          fontSize: 12,
                          cursor: 'pointer'
                        }}
                      >
                        View
                      </button>
                      <button 
                        onClick={() => handleAdjustStock(item.id)}
                        style={{
                          padding: '6px 12px',
                          background: COLORS.secondary.teal,
                          color: 'white',
                          border: 'none',
                          borderRadius: 6,
                          fontSize: 12,
                          cursor: 'pointer'
                        }}
                      >
                        Adjust
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};
