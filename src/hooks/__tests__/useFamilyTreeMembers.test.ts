import { renderHook, act } from '@testing-library/react';
import { FamilyTree, Member } from '@/types/family-tree';

// 模拟TextDecoder和TextEncoder，解决@neondatabase/serverless的依赖问题
global.TextDecoder = require('util').TextDecoder;
global.TextEncoder = require('util').TextEncoder;

// 模拟整个模块，避免实际导入
jest.mock('@/lib/family-tree-utils', () => ({
  generateUniqueId: jest.fn().mockReturnValue('mock-id-123'),
  addMemberToFamilyTree: jest.fn()
}));

// 在模拟后导入，确保使用的是模拟版本
import { useFamilyTreeMembers } from '../useFamilyTreeMembers';
import {
  generateUniqueId,
  addMemberToFamilyTree
} from '@/lib/family-tree-utils';

describe('useFamilyTreeMembers Hook', () => {
  // 模拟数据
  const mockMember: Member = {
    id: 'test-id-1',
    name: 'John Doe',
    relation: 'father',
    gender: 'male',
  };

  const mockFamilyTree: FamilyTree = {
    members: [mockMember],
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  };

  // 模拟更新回调
  const mockUpdateFamilyTree = jest.fn();

  // 在每个测试前重置模拟
  beforeEach(() => {
    jest.clearAllMocks();
    
    // 模拟addMemberToFamilyTree返回更新后的家谱
    (addMemberToFamilyTree as jest.Mock).mockImplementation((familyTree, newMember) => ({
      ...familyTree,
      members: [...familyTree.members, newMember],
      updatedAt: '2023-01-01T00:00:00.000Z',
    }));
    
    // 模拟控制台错误，避免测试输出中的噪音
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // 恢复控制台错误
    jest.restoreAllMocks();
  });

  it('应该初始化为默认成员状态', () => {
    const { result } = renderHook(() => useFamilyTreeMembers(mockFamilyTree, mockUpdateFamilyTree));
    
    // 验证初始状态
    expect(result.current.currentMember).toEqual({
      name: '',
      relation: '',
      gender: 'male'
    });
  });

  it('应该处理输入变化', () => {
    const { result } = renderHook(() => useFamilyTreeMembers(mockFamilyTree, mockUpdateFamilyTree));
    
    // 修改名称
    act(() => {
      result.current.handleInputChange('name', 'Jane Doe');
    });
    
    // 验证名称已更新
    expect(result.current.currentMember.name).toBe('Jane Doe');
    
    // 修改关系
    act(() => {
      result.current.handleInputChange('relation', 'mother');
    });
    
    // 验证关系已更新
    expect(result.current.currentMember.relation).toBe('mother');
    
    // 修改性别
    act(() => {
      result.current.handleInputChange('gender', 'female');
    });
    
    // 验证性别已更新
    expect(result.current.currentMember.gender).toBe('female');
    
    // 修改出生日期
    act(() => {
      result.current.handleInputChange('birthDate', '1985-05-05');
    });
    
    // 验证出生日期已更新
    expect(result.current.currentMember.birthDate).toBe('1985-05-05');
  });

  it('应该重置表单', () => {
    const { result } = renderHook(() => useFamilyTreeMembers(mockFamilyTree, mockUpdateFamilyTree));
    
    // 修改成员数据
    act(() => {
      result.current.handleInputChange('name', 'Jane Doe');
      result.current.handleInputChange('relation', 'mother');
      result.current.handleInputChange('gender', 'female');
      result.current.handleInputChange('birthDate', '1985-05-05');
    });
    
    // 验证成员数据已更新
    expect(result.current.currentMember).toEqual({
      name: 'Jane Doe',
      relation: 'mother',
      gender: 'female',
      birthDate: '1985-05-05'
    });
    
    // 重置表单
    act(() => {
      result.current.resetForm();
    });
    
    // 验证表单已重置
    expect(result.current.currentMember).toEqual({
      name: '',
      relation: '',
      gender: 'male',
      birthDate: '',
    });
  });

  it('应该验证成员数据', () => {
    const { result } = renderHook(() => useFamilyTreeMembers(mockFamilyTree, mockUpdateFamilyTree));
    
    // 验证空数据
    let validation = result.current.validateMember();
    expect(validation.isValid).toBe(false);
    expect(validation.errorMessage).toBe('姓名和关系都是必填字段');
    
    // 只设置名称
    act(() => {
      result.current.handleInputChange('name', 'Jane Doe');
    });
    
    validation = result.current.validateMember();
    expect(validation.isValid).toBe(false);
    expect(validation.errorMessage).toBe('姓名和关系都是必填字段');
    
    // 只设置关系
    act(() => {
      result.current.handleInputChange('name', '');
      result.current.handleInputChange('relation', 'mother');
    });
    
    validation = result.current.validateMember();
    expect(validation.isValid).toBe(false);
    expect(validation.errorMessage).toBe('姓名和关系都是必填字段');
    
    // 设置名称和关系
    act(() => {
      result.current.handleInputChange('name', 'Jane Doe');
      result.current.handleInputChange('relation', 'mother');
    });
    
    validation = result.current.validateMember();
    expect(validation.isValid).toBe(true);
    expect(validation.errorMessage).toBeUndefined();
  });

  it('应该添加新成员', () => {
    const { result } = renderHook(() => useFamilyTreeMembers(mockFamilyTree, mockUpdateFamilyTree));
    
    // 设置成员数据
    act(() => {
      result.current.handleInputChange('name', 'Jane Doe');
      result.current.handleInputChange('relation', 'mother');
      result.current.handleInputChange('gender', 'female');
      result.current.handleInputChange('birthDate', '1985-05-05');
    });
    
    // 添加成员
    let addResult;
    act(() => {
      addResult = result.current.addMember();
    });
    
    // 验证添加结果
    expect(addResult).toEqual({ success: true });
    
    // 验证generateUniqueId被调用
    expect(generateUniqueId).toHaveBeenCalled();
    
    // 验证addMemberToFamilyTree被调用，并传入正确的参数
    expect(addMemberToFamilyTree).toHaveBeenCalledWith(mockFamilyTree, {
      id: 'mock-id-123',
      name: 'Jane Doe',
      relation: 'mother',
      gender: 'female',
      birthDate: '1985-05-05',
    });
    
    // 验证更新回调被调用
    expect(mockUpdateFamilyTree).toHaveBeenCalled();
    
    // 验证表单已重置
    expect(result.current.currentMember).toEqual({
      name: '',
      relation: '',
      gender: 'male',
      birthDate: '',
    });
  });

  it('应该处理添加成员时的验证错误', () => {
    const { result } = renderHook(() => useFamilyTreeMembers(mockFamilyTree, mockUpdateFamilyTree));
    
    // 不设置任何数据，直接添加成员
    let addResult;
    act(() => {
      addResult = result.current.addMember();
    });
    
    // 验证添加结果
    expect(addResult).toEqual({
      success: false,
      error: '姓名和关系都是必填字段'
    });
    
    // 验证generateUniqueId未被调用
    expect(generateUniqueId).not.toHaveBeenCalled();
    
    // 验证addMemberToFamilyTree未被调用
    expect(addMemberToFamilyTree).not.toHaveBeenCalled();
    
    // 验证更新回调未被调用
    expect(mockUpdateFamilyTree).not.toHaveBeenCalled();
  });

  it('应该处理添加成员时的异常', () => {
    const { result } = renderHook(() => useFamilyTreeMembers(mockFamilyTree, mockUpdateFamilyTree));
    
    // 设置成员数据
    act(() => {
      result.current.handleInputChange('name', 'Jane Doe');
      result.current.handleInputChange('relation', 'mother');
    });
    
    // 模拟addMemberToFamilyTree抛出错误
    (addMemberToFamilyTree as jest.Mock).mockImplementation(() => {
      throw new Error('添加成员失败');
    });
    
    // 添加成员
    let addResult;
    act(() => {
      addResult = result.current.addMember();
    });
    
    // 验证添加结果
    expect(addResult).toEqual({
      success: false,
      error: '添加成员失败'
    });
    
    // 验证控制台错误被调用
    expect(console.error).toHaveBeenCalled();
    
    // 验证更新回调未被调用
    expect(mockUpdateFamilyTree).not.toHaveBeenCalled();
  });

  it('应该删除成员', () => {
    const { result } = renderHook(() => useFamilyTreeMembers(mockFamilyTree, mockUpdateFamilyTree));
    
    // 删除成员
    let deleteResult;
    act(() => {
      deleteResult = result.current.deleteMember('test-id-1');
    });
    
    // 验证删除结果
    expect(deleteResult).toEqual({ success: true });
    
    // 验证更新回调被调用，并传入正确的参数
    expect(mockUpdateFamilyTree).toHaveBeenCalledWith({
      ...mockFamilyTree,
      members: []
    });
  });

  it('应该处理删除成员时的异常', () => {
    // 模拟mockUpdateFamilyTree抛出错误
    mockUpdateFamilyTree.mockImplementation(() => {
      throw new Error('删除成员失败');
    });
    
    const { result } = renderHook(() => useFamilyTreeMembers(mockFamilyTree, mockUpdateFamilyTree));
    
    // 删除成员
    let deleteResult;
    act(() => {
      deleteResult = result.current.deleteMember('test-id-1');
    });
    
    // 验证删除结果
    expect(deleteResult).toEqual({
      success: false,
      error: '删除成员失败'
    });
    
    // 验证控制台错误被调用
    expect(console.error).toHaveBeenCalled();
  });
});
