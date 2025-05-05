import React from 'react';
import { render, screen } from '@/lib/test-utils';
import DroppableArea from '../DroppableArea';
import { useDroppable } from '@dnd-kit/core';

// 模拟@dnd-kit/core的useDroppable hook
jest.mock('@dnd-kit/core', () => ({
  useDroppable: jest.fn()
}));

describe('DroppableArea组件', () => {
  // 默认props
  const defaultProps = {
    id: 'test-droppable-area',
    children: <div data-testid="test-children">Test Content</div>
  };

  beforeEach(() => {
    // 重置所有模拟
    jest.clearAllMocks();

    // 默认模拟返回值
    (useDroppable as jest.Mock).mockReturnValue({
      isOver: false,
      setNodeRef: jest.fn()
    });
  });

  it('应该正确渲染子元素', () => {
    render(<DroppableArea {...defaultProps} />);

    // 验证子元素被正确渲染
    expect(screen.getByTestId('test-children')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('应该使用正确的id调用useDroppable', () => {
    render(<DroppableArea {...defaultProps} />);

    // 验证useDroppable被调用，并且传入了正确的id
    expect(useDroppable).toHaveBeenCalledWith({
      id: 'test-droppable-area'
    });
  });

  it('应该在isOver为true时调用cn函数', () => {
    // 模拟isOver为true
    (useDroppable as jest.Mock).mockReturnValue({
      isOver: true,
      setNodeRef: jest.fn()
    });

    // 模拟cn函数
    jest.mock('@/lib/utils', () => ({
      cn: jest.fn((...args) => args.join(' '))
    }));

    render(<DroppableArea {...defaultProps} />);

    // 验证useDroppable被调用，并且isOver为true
    expect(useDroppable).toHaveBeenCalledWith({
      id: 'test-droppable-area'
    });

    // 验证子元素被正确渲染，表明组件正常工作
    expect(screen.getByTestId('test-children')).toBeInTheDocument();
  });

  it('应该接受并使用自定义className', () => {
    const customClassName = 'custom-class';

    render(
      <DroppableArea {...defaultProps} className={customClassName} />
    );

    // 验证useDroppable被调用
    expect(useDroppable).toHaveBeenCalledWith({
      id: 'test-droppable-area'
    });

    // 验证子元素被正确渲染，表明组件正常工作
    expect(screen.getByTestId('test-children')).toBeInTheDocument();
  });

  it('应该调用setNodeRef', () => {
    // 创建一个模拟的setNodeRef函数
    const mockSetNodeRef = jest.fn();

    // 模拟返回值
    (useDroppable as jest.Mock).mockReturnValue({
      isOver: false,
      setNodeRef: mockSetNodeRef
    });

    render(<DroppableArea {...defaultProps} />);

    // 验证setNodeRef被调用
    expect(mockSetNodeRef).toHaveBeenCalled();
  });
});
