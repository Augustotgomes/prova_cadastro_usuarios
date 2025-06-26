import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Loader, LoadingButton, LoadingOverlay } from './Loader';

describe('Loader Component', () => {
  it('renders with default props', () => {
    render(<Loader />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders with custom text', () => {
    const testText = 'Loading data...';
    render(<Loader text={testText} />);
    
    expect(screen.getByText(testText)).toBeInTheDocument();
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<Loader size="sm" />);
    expect(screen.getByRole('status')).toHaveClass('spinner-border-sm');
    
    rerender(<Loader size="lg" />);
    expect(screen.getByRole('status')).not.toHaveClass('spinner-border-sm');
  });

  it('renders with different variants', () => {
    render(<Loader variant="danger" />);
    expect(screen.getByRole('status')).toHaveClass('text-danger');
  });

  it('renders as overlay when overlay prop is true', () => {
    render(<Loader overlay text="Loading..." />);
    
    const overlayElement = screen.getByText('Loading...').closest('.position-fixed');
    expect(overlayElement).toBeInTheDocument();
    expect(overlayElement).toHaveStyle({ zIndex: '9999' });
  });

  it('applies custom className', () => {
    const customClass = 'custom-loader';
    render(<Loader className={customClass} />);
    
    const loaderContainer = screen.getByRole('status').closest('.d-flex');
    expect(loaderContainer).toHaveClass(customClass);
  });
});

describe('LoadingButton Component', () => {
  it('renders children when not loading', () => {
    render(<LoadingButton loading={false}>Click me</LoadingButton>);
    
    expect(screen.getByText('Click me')).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('shows spinner when loading', () => {
    render(<LoadingButton loading={true}>Click me</LoadingButton>);
    
    expect(screen.getByText('Click me')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('is disabled when loading', () => {
    render(<LoadingButton loading={true}>Click me</LoadingButton>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('is disabled when disabled prop is true', () => {
    render(<LoadingButton loading={false} disabled={true}>Click me</LoadingButton>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('calls onClick when clicked and not loading', () => {
    const handleClick = vi.fn();
    render(<LoadingButton loading={false} onClick={handleClick}>Click me</LoadingButton>);
    
    const button = screen.getByRole('button');
    button.click();
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct variant class', () => {
    render(<LoadingButton loading={false} variant="danger">Click me</LoadingButton>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn-danger');
  });

  it('applies correct size class', () => {
    render(<LoadingButton loading={false} size="lg">Click me</LoadingButton>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn-lg');
  });

  it('has correct type attribute', () => {
    render(<LoadingButton loading={false} type="submit">Submit</LoadingButton>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
  });
});

describe('LoadingOverlay Component', () => {
  it('renders children when not loading', () => {
    render(
      <LoadingOverlay loading={false}>
        <div>Content</div>
      </LoadingOverlay>
    );
    
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.queryByText('Carregando...')).not.toBeInTheDocument();
  });

  it('shows overlay when loading', () => {
    render(
      <LoadingOverlay loading={true}>
        <div>Content</div>
      </LoadingOverlay>
    );
    
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('shows custom loading text', () => {
    const customText = 'Please wait...';
    render(
      <LoadingOverlay loading={true} text={customText}>
        <div>Content</div>
      </LoadingOverlay>
    );
    
    expect(screen.getByText(customText)).toBeInTheDocument();
  });

  it('has correct overlay styling', () => {
    render(
      <LoadingOverlay loading={true}>
        <div>Content</div>
      </LoadingOverlay>
    );
    
    const overlay = screen.getByText('Carregando...').closest('.position-absolute');
    expect(overlay).toHaveStyle({ zIndex: '10' });
    expect(overlay).toHaveClass('position-absolute', 'top-0', 'start-0', 'w-100', 'h-100');
  });
});

