import { describe, it, expect, vi } from 'vitest';
import {
  formatCpf,
  formatPhone,
  formatCep,
  formatDate,
  parseDate,
  validateCpf,
  validateEmail,
  onlyNumbers,
  capitalizeWords,
  truncateText,
  debounce,
} from '../services/utils';

describe('Utility Functions', () => {
  describe('formatCpf', () => {
    it('formats valid CPF correctly', () => {
      expect(formatCpf('12345678901')).toBe('123.456.789-01');
    });

    it('returns original value for invalid length', () => {
      expect(formatCpf('123')).toBe('123');
      expect(formatCpf('123456789012')).toBe('123456789012');
    });

    it('handles already formatted CPF', () => {
      expect(formatCpf('123.456.789-01')).toBe('123.456.789-01');
    });

    it('handles empty string', () => {
      expect(formatCpf('')).toBe('');
    });
  });

  describe('formatPhone', () => {
    it('formats 11-digit phone correctly', () => {
      expect(formatPhone('11999999999')).toBe('(11) 99999-9999');
    });

    it('formats 10-digit phone correctly', () => {
      expect(formatPhone('1199999999')).toBe('(11) 9999-9999');
    });

    it('returns original value for invalid length', () => {
      expect(formatPhone('123')).toBe('123');
      expect(formatPhone('123456789012')).toBe('123456789012');
    });

    it('handles already formatted phone', () => {
      expect(formatPhone('(11) 99999-9999')).toBe('(11) 99999-9999');
    });

    it('handles empty string', () => {
      expect(formatPhone('')).toBe('');
    });
  });

  describe('formatCep', () => {
    it('formats valid CEP correctly', () => {
      expect(formatCep('01310100')).toBe('01310-100');
    });

    it('returns original value for invalid length', () => {
      expect(formatCep('123')).toBe('123');
      expect(formatCep('123456789')).toBe('123456789');
    });

    it('handles already formatted CEP', () => {
      expect(formatCep('01310-100')).toBe('01310-100');
    });

    it('handles empty string', () => {
      expect(formatCep('')).toBe('');
    });
  });

  describe('formatDate', () => {
    it('formats ISO date to Brazilian format', () => {
      expect(formatDate('1990-05-15')).toBe('15/05/1990');
    });

    it('handles empty string', () => {
      expect(formatDate('')).toBe('');
    });

    it('handles invalid date format gracefully', () => {
      expect(formatDate('invalid')).toBe('invalid');
    });
  });

  describe('parseDate', () => {
    it('parses Brazilian date to ISO format', () => {
      expect(parseDate('15/05/1990')).toBe('1990-05-15');
    });

    it('handles empty string', () => {
      expect(parseDate('')).toBe('');
    });

    it('pads single digits correctly', () => {
      expect(parseDate('5/5/1990')).toBe('1990-05-05');
    });
  });

  describe('validateCpf', () => {
    it('validates correct CPF', () => {
      expect(validateCpf('11144477735')).toBe(true);
      expect(validateCpf('111.444.777-35')).toBe(true);
    });

    it('rejects invalid CPF', () => {
      expect(validateCpf('12345678901')).toBe(false);
      expect(validateCpf('111.444.777-36')).toBe(false);
    });

    it('rejects CPF with all same digits', () => {
      expect(validateCpf('11111111111')).toBe(false);
      expect(validateCpf('000.000.000-00')).toBe(false);
    });

    it('rejects CPF with wrong length', () => {
      expect(validateCpf('123')).toBe(false);
      expect(validateCpf('123456789012')).toBe(false);
    });

    it('handles empty string', () => {
      expect(validateCpf('')).toBe(false);
    });
  });

  describe('validateEmail', () => {
    it('validates correct email', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('rejects invalid email', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('test.domain.com')).toBe(false);
    });

    it('handles empty string', () => {
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('onlyNumbers', () => {
    it('removes non-numeric characters', () => {
      expect(onlyNumbers('123abc456')).toBe('123456');
      expect(onlyNumbers('(11) 99999-9999')).toBe('11999999999');
      expect(onlyNumbers('123.456.789-01')).toBe('12345678901');
    });

    it('handles string with only numbers', () => {
      expect(onlyNumbers('123456')).toBe('123456');
    });

    it('handles empty string', () => {
      expect(onlyNumbers('')).toBe('');
    });

    it('handles string with no numbers', () => {
      expect(onlyNumbers('abc')).toBe('');
    });
  });

  describe('capitalizeWords', () => {
    it('capitalizes first letter of each word', () => {
      expect(capitalizeWords('joão silva')).toBe('João Silva');
      expect(capitalizeWords('MARIA SANTOS')).toBe('Maria Santos');
      expect(capitalizeWords('pedro de oliveira')).toBe('Pedro De Oliveira');
    });

    it('handles single word', () => {
      expect(capitalizeWords('joão')).toBe('João');
    });

    it('handles empty string', () => {
      expect(capitalizeWords('')).toBe('');
    });

    it('handles multiple spaces', () => {
      expect(capitalizeWords('joão  silva')).toBe('João  Silva');
    });
  });

  describe('truncateText', () => {
    it('truncates text longer than maxLength', () => {
      expect(truncateText('This is a long text', 10)).toBe('This is...');
    });

    it('returns original text if shorter than maxLength', () => {
      expect(truncateText('Short', 10)).toBe('Short');
    });

    it('returns original text if equal to maxLength', () => {
      expect(truncateText('Exactly10!', 10)).toBe('Exactly10!');
    });

    it('handles empty string', () => {
      expect(truncateText('', 10)).toBe('');
    });

    it('handles maxLength smaller than ellipsis', () => {
      expect(truncateText('Test', 2)).toBe('...');
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('delays function execution', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('test');
      expect(mockFn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledWith('test');
    });

    it('cancels previous calls', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('first');
      debouncedFn('second');
      debouncedFn('third');

      vi.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('third');
    });

    it('handles multiple arguments', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('arg1', 'arg2', 'arg3');
      vi.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2', 'arg3');
    });

    it('preserves function return type', () => {
      const mockFn = vi.fn().mockReturnValue('result');
      const debouncedFn = debounce(mockFn, 100);

      // The debounced function should return void
      const result = debouncedFn('test');
      expect(result).toBeUndefined();
    });
  });
});

