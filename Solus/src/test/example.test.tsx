import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

// A simple component for testing
function ExampleComponent() {
  return <div>Hello, Solus!</div>;
}

describe('Example test', () => {
  it('renders correctly', () => {
    render(<ExampleComponent />);
    expect(screen.getByText('Hello, Solus!')).toBeInTheDocument();
  });

  it('basic test works', () => {
    expect(1 + 1).toBe(2);
  });
}); 