import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import OperatorDashboard from '../src/pages/OperatorDashboard';

global.mockSocket = {
  on: jest.fn(),
  emit: jest.fn(),
};

describe('Socket events', () => {
  it('handles workorder events', async () => {
    render(<OperatorDashboard />);
    act(() => {
      global.mockSocket.on.mock.calls.forEach(([event, handler]) => {
        if (event === 'workorder.events') handler({ id: 'WO-001', status: 'Started' });
      });
    });
    expect(screen.getByText(/WO-001/i)).toBeInTheDocument();
    expect(screen.getByText(/Started/i)).toBeInTheDocument();
  });
});
