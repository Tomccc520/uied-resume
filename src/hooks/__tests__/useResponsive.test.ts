/**
 * useResponsive Hook 单元测试
 */

import { renderHook } from '@testing-library/react';
import { useResponsive, useIsMobile, useMediaQuery } from '../useResponsive';

// Mock window.matchMedia
const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
};

describe('useResponsive', () => {
  // 保存原始的 innerWidth 和 innerHeight
  const originalInnerWidth = window.innerWidth;
  const originalInnerHeight = window.innerHeight;

  beforeEach(() => {
    // 重置窗口尺寸
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    });
  });

  afterEach(() => {
    // 恢复原始值
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: originalInnerHeight,
    });
  });

  it('应该返回正确的断点和设备类型', () => {
    const { result } = renderHook(() => useResponsive());

    expect(result.current.breakpoint).toBe('lg');
    expect(result.current.deviceType).toBe('desktop');
    expect(result.current.isDesktop).toBe(true);
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(false);
  });

  it('应该在移动设备上返回正确的值', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 375,
    });

    const { result } = renderHook(() => useResponsive());

    expect(result.current.breakpoint).toBe('xs');
    expect(result.current.deviceType).toBe('mobile');
    expect(result.current.isMobile).toBe(true);
  });

  it('应该在平板设备上返回正确的值', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 768,
    });

    const { result } = renderHook(() => useResponsive());

    expect(result.current.breakpoint).toBe('md');
    expect(result.current.deviceType).toBe('tablet');
    expect(result.current.isTablet).toBe(true);
  });

  it('isBelow 方法应该正常工作', () => {
    const { result } = renderHook(() => useResponsive());

    expect(result.current.isBelow('xl')).toBe(true);
    expect(result.current.isBelow('md')).toBe(false);
  });

  it('isAbove 方法应该正常工作', () => {
    const { result } = renderHook(() => useResponsive());

    expect(result.current.isAbove('md')).toBe(true);
    expect(result.current.isAbove('xl')).toBe(false);
  });

  it('isBetween 方法应该正常工作', () => {
    const { result } = renderHook(() => useResponsive());

    expect(result.current.isBetween('md', 'xl')).toBe(true);
    expect(result.current.isBetween('xs', 'sm')).toBe(false);
  });
});

describe('useIsMobile', () => {
  it('应该在移动设备上返回 true', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 375,
    });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('应该在桌面设备上返回 false', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 1024,
    });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });
});

describe('useMediaQuery', () => {
  it('应该返回媒体查询匹配结果', () => {
    mockMatchMedia(true);

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(true);
  });

  it('应该在不匹配时返回 false', () => {
    mockMatchMedia(false);

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(false);
  });
});
