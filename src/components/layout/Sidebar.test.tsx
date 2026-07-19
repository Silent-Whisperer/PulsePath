// @vitest-environment jsdom
import { describe, test, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from './Sidebar';

afterEach(() => {
  cleanup();
});

describe('Sidebar Component', () => {
  test('renders navigation links based on fan role', () => {
    const setRoleMock = vi.fn();
    render(
      <MemoryRouter>
        <Sidebar role="fan" setRole={setRoleMock} pathname="/fan" />
      </MemoryRouter>
    );

    // Fan should see Match Journey, AI Navigation, Ask Pulse, Sustainability
    expect(screen.getByText('Match Journey')).toBeDefined();
    expect(screen.getByText('AI Navigation')).toBeDefined();
    expect(screen.getByText('Ask Pulse')).toBeDefined();
    expect(screen.getByText('Sustainability')).toBeDefined();

    // Check that volunteer navigation item is NOT present
    expect(screen.queryByText('Task Hub')).toBeNull();
  });

  test('renders volunteer navigation links when role is volunteer', () => {
    const setRoleMock = vi.fn();
    render(
      <MemoryRouter>
        <Sidebar role="volunteer" setRole={setRoleMock} pathname="/volunteer" />
      </MemoryRouter>
    );

    expect(screen.getByText('Task Hub')).toBeDefined();
    expect(screen.queryByText('Match Journey')).toBeNull();
  });

  test('calls setRole when selecting a different role in the dropdown', () => {
    const setRoleMock = vi.fn();
    render(
      <MemoryRouter>
        <Sidebar role="fan" setRole={setRoleMock} pathname="/fan" />
      </MemoryRouter>
    );

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'operations' } });

    expect(setRoleMock).toHaveBeenCalledWith('operations');
  });
});
