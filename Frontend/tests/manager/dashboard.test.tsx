import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen } from '@testing-library/react';
import ManagerDashboard from '../../src/pages/ManagerDashboard';

const server = setupServer(
  rest.get('/api/manufacturing', (req, res, ctx) => {
    return res(ctx.json({ totalOrders: 128, completed: 72, inProgress: 34, urgent: 6 }));
  }),
  rest.get('/api/reports/throughput', (req, res, ctx) => {
    return res(ctx.json({ throughput: [10, 12, 14, 16] }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('renders KPIs and table', async () => {
  render(<ManagerDashboard />);
  expect(await screen.findByText(/Total Manufacturing Orders/i)).toBeInTheDocument();
  expect(await screen.findByText(/Orders Completed/i)).toBeInTheDocument();
  expect(await screen.findByText(/Orders In Progress/i)).toBeInTheDocument();
  expect(await screen.findByText(/Urgent Orders/i)).toBeInTheDocument();
  expect(await screen.findByText(/Active Manufacturing Orders/i)).toBeInTheDocument();
});
