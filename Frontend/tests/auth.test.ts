import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginPage from '../src/pages/auth/LoginPage';

describe('Login Flow', () => {
  const server = setupServer(
    rest.post('/api/auth/login', (req, res, ctx) => {
      return res(ctx.json({ token: 'mock-token' }));
    })
  );

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('logs in and redirects', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'user@test.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(await screen.findByText(/dashboard/i)).toBeInTheDocument();
  });
});
