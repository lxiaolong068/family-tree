import {
  generateUniqueId,
  createNewFamilyTree,
  generateMermaidChart,
  buildFamilyRelations,
  addMemberToFamilyTree,
  saveFamilyTreeToLocalStorage,
  loadFamilyTreeFromLocalStorage,
  addRelationshipToMember,
  removeRelationship
} from '../family-tree-utils';
import { Member, FamilyTree, RelationType, Relationship } from '@/types/family-tree';

// 模拟数据库，避免测试时实际调用数据库
jest.mock('@/db', () => ({
  db: null,
  isDatabaseConfigured: jest.fn().mockReturnValue(false)
}));

// 模拟localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn()
};

describe('家谱工具函数测试', () => {
  // 在每个测试前设置模拟的localStorage
  beforeEach(() => {
    // 清除所有模拟的调用记录
    jest.clearAllMocks();

    // 设置模拟的localStorage
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    });

    // 模拟console方法以避免测试输出中的噪音
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  describe('generateUniqueId', () => {
    it('应该生成不同的ID', () => {
      const id1 = generateUniqueId();
      const id2 = generateUniqueId();
      expect(id1).not.toEqual(id2);
    });

    it('生成的ID应该是字符串类型', () => {
      const id = generateUniqueId();
      expect(typeof id).toBe('string');
    });
  });

  describe('createNewFamilyTree', () => {
    it('应该创建有效的空家谱对象', () => {
      const tree = createNewFamilyTree();
      expect(tree).toHaveProperty('members');
      expect(tree.members).toEqual([]);
      expect(tree).toHaveProperty('createdAt');
      expect(tree).toHaveProperty('updatedAt');
    });

    it('createdAt和updatedAt应该是有效的ISO日期字符串', () => {
      const tree = createNewFamilyTree();
      expect(() => new Date(tree.createdAt)).not.toThrow();
      expect(() => new Date(tree.updatedAt)).not.toThrow();
    });
  });

  describe('generateMermaidChart', () => {
    it('当没有成员时应该返回空图表', () => {
      const chart = generateMermaidChart([]);
      expect(chart).toContain('EmptyNode["No family tree data yet"]');
    });

    it('应该为有成员的家谱生成正确的图表', () => {
      const members: Member[] = [
        { id: '1', name: '祖父', relation: '父亲', gender: 'male' },
        { id: '2', name: '儿子', relation: '儿子', parentId: '1', gender: 'male' }
      ];

      const chart = generateMermaidChart(members);
      expect(chart).toContain('flowchart TD');
      expect(chart).toContain('1([祖父])');
      expect(chart).toContain('2([儿子])');
      expect(chart).toContain('1 --> 2');
    });
  });

  describe('buildFamilyRelations', () => {
    it('应该根据关系设置parentId', () => {
      const members: Member[] = [
        { id: '1', name: '父亲', relation: '父亲' },
        { id: '2', name: '儿子', relation: '儿子' }
      ];

      const result = buildFamilyRelations(members);
      // 检查关系是否已建立
      const sonMember = result.find(m => m.relation === '儿子');
      expect(sonMember?.parentId).toBe('1');
    });
  });

  describe('addMemberToFamilyTree', () => {
    it('应该向家谱添加新成员', () => {
      const tree = createNewFamilyTree();
      const newMember = { name: '测试成员', relation: '父亲' };

      const updatedTree = addMemberToFamilyTree(tree, newMember);
      expect(updatedTree.members.length).toBe(1);
      expect(updatedTree.members[0].name).toBe('测试成员');
      expect(updatedTree.members[0].relation).toBe('父亲');
      expect(updatedTree.members[0]).toHaveProperty('id');
    });

    it('应该保留原有成员并更新updatedAt', () => {
      jest.useFakeTimers();

      const tree = createNewFamilyTree();
      const member1 = { name: '成员1', relation: '父亲' };
      const member2 = { name: '成员2', relation: '儿子' };

      const originalDate = new Date('2025-01-01');
      jest.setSystemTime(originalDate);

      const tree1 = addMemberToFamilyTree(tree, member1);

      // 前进1000毫秒以确保时间戳不同
      const newDate = new Date('2025-01-01');
      newDate.setMilliseconds(1000);
      jest.setSystemTime(newDate);

      const tree2 = addMemberToFamilyTree(tree1, member2);

      expect(tree2.members.length).toBe(2);
      expect(tree2.members[0].name).toBe('成员1');
      expect(tree2.members[1].name).toBe('成员2');
      expect(tree2.updatedAt).not.toEqual(tree1.updatedAt);

      jest.useRealTimers();
    });
  });

  describe('saveFamilyTreeToLocalStorage', () => {
    it('应该将家谱保存到localStorage', () => {
      const familyTree: FamilyTree = {
        members: [
          { id: '1', name: '张三', relation: '父亲' },
          { id: '2', name: '李四', relation: '儿子', parentId: '1' }
        ],
        name: '测试家谱',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z'
      };

      saveFamilyTreeToLocalStorage(familyTree);

      // 验证localStorage.setItem被调用
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'familyTree',
        JSON.stringify(familyTree)
      );
    });

    it('应该使用自定义键名保存家谱', () => {
      const familyTree: FamilyTree = createNewFamilyTree();
      const customKey = 'customFamilyTree';

      saveFamilyTreeToLocalStorage(familyTree, customKey);

      // 验证localStorage.setItem被调用，使用自定义键名
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        customKey,
        JSON.stringify(familyTree)
      );
    });

    it('应该处理localStorage.setItem抛出的错误', () => {
      // 模拟localStorage.setItem抛出错误
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('localStorage已满');
      });

      const familyTree: FamilyTree = createNewFamilyTree();

      // 不应该抛出错误
      expect(() => {
        saveFamilyTreeToLocalStorage(familyTree);
      }).not.toThrow();

      // 验证console.error被调用
      expect(console.error).toHaveBeenCalled();
    });

    it('应该在服务器端环境中发出警告', () => {
      // 保存原始的typeof window实现
      const originalTypeofWindow = Object.getOwnPropertyDescriptor(global, 'window');

      // 模拟typeof window === 'undefined'
      Object.defineProperty(global, 'window', {
        configurable: true,
        get: () => undefined
      });

      // 重置console.warn的模拟
      (console.warn as jest.Mock).mockClear();

      const familyTree: FamilyTree = createNewFamilyTree();

      saveFamilyTreeToLocalStorage(familyTree);

      // 验证console.warn被调用
      expect(console.warn).toHaveBeenCalledWith('无法在服务器端使用localStorage');

      // 验证localStorage.setItem没有被调用
      expect(mockLocalStorage.setItem).not.toHaveBeenCalled();

      // 恢复原始的window属性
      if (originalTypeofWindow) {
        Object.defineProperty(global, 'window', originalTypeofWindow);
      } else {
        delete (global as any).window;
      }
    });
  });

  describe('loadFamilyTreeFromLocalStorage', () => {
    it('应该从localStorage加载家谱', () => {
      const familyTree: FamilyTree = {
        members: [
          { id: '1', name: '张三', relation: '父亲' },
          { id: '2', name: '李四', relation: '儿子', parentId: '1' }
        ],
        name: '测试家谱',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z'
      };

      // 模拟localStorage.getItem返回家谱数据
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(familyTree));

      const result = loadFamilyTreeFromLocalStorage();

      // 验证localStorage.getItem被调用
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('familyTree');

      // 验证返回的家谱数据
      expect(result).toEqual(familyTree);
    });

    it('应该使用自定义键名加载家谱', () => {
      const familyTree: FamilyTree = createNewFamilyTree();
      const customKey = 'customFamilyTree';

      // 模拟localStorage.getItem返回家谱数据
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(familyTree));

      loadFamilyTreeFromLocalStorage(customKey);

      // 验证localStorage.getItem被调用，使用自定义键名
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith(customKey);
    });

    it('当localStorage中没有数据时，应该返回新的家谱', () => {
      // 模拟localStorage.getItem返回null
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = loadFamilyTreeFromLocalStorage();

      // 验证返回的是新的家谱
      expect(result).toHaveProperty('members');
      expect(result.members).toEqual([]);
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
    });

    it('应该处理JSON.parse抛出的错误', () => {
      // 模拟localStorage.getItem返回无效的JSON
      mockLocalStorage.getItem.mockReturnValue('无效的JSON');

      const result = loadFamilyTreeFromLocalStorage();

      // 验证console.error被调用
      expect(console.error).toHaveBeenCalled();

      // 验证返回的是新的家谱
      expect(result).toHaveProperty('members');
      expect(result.members).toEqual([]);
    });

    it('应该在服务器端环境中发出警告并返回新的家谱', () => {
      // 保存原始的typeof window实现
      const originalTypeofWindow = Object.getOwnPropertyDescriptor(global, 'window');

      // 模拟typeof window === 'undefined'
      Object.defineProperty(global, 'window', {
        configurable: true,
        get: () => undefined
      });

      // 重置console.warn的模拟
      (console.warn as jest.Mock).mockClear();

      const result = loadFamilyTreeFromLocalStorage();

      // 验证console.warn被调用
      expect(console.warn).toHaveBeenCalledWith('无法在服务器端使用localStorage');

      // 验证localStorage.getItem没有被调用
      expect(mockLocalStorage.getItem).not.toHaveBeenCalled();

      // 验证返回的是新的家谱
      expect(result).toHaveProperty('members');
      expect(result.members).toEqual([]);

      // 恢复原始的window属性
      if (originalTypeofWindow) {
        Object.defineProperty(global, 'window', originalTypeofWindow);
      } else {
        delete (global as any).window;
      }
    });
  });

  describe('addRelationshipToMember', () => {
    it('应该添加父子关系', () => {
      // 创建测试家谱
      const familyTree: FamilyTree = {
        members: [
          { id: 'parent-1', name: '父亲', relation: '父亲' },
          { id: 'child-1', name: '儿子', relation: '儿子' }
        ],
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z'
      };

      // 创建父子关系
      const relationship: Relationship = {
        type: RelationType.PARENT,
        targetId: 'parent-1',
        description: '父亲关系'
      };

      // 添加关系
      const updatedTree = addRelationshipToMember(familyTree, 'child-1', relationship);

      // 验证关系是否添加成功
      const childMember = updatedTree.members.find(m => m.id === 'child-1');
      expect(childMember).toBeDefined();
      expect(childMember?.relationships).toBeDefined();
      expect(childMember?.relationships?.length).toBe(1);
      expect(childMember?.relationships?.[0].type).toBe(RelationType.PARENT);
      expect(childMember?.relationships?.[0].targetId).toBe('parent-1');
      expect(childMember?.parentId).toBe('parent-1'); // 验证parentId也被设置

      // 验证updatedAt是否更新
      expect(updatedTree.updatedAt).not.toBe(familyTree.updatedAt);
    });

    it('应该添加配偶关系（双向关系）', () => {
      // 创建测试家谱
      const familyTree: FamilyTree = {
        members: [
          { id: 'member-1', name: '丈夫', relation: '丈夫' },
          { id: 'member-2', name: '妻子', relation: '妻子' }
        ],
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z'
      };

      // 创建配偶关系
      const relationship: Relationship = {
        type: RelationType.SPOUSE,
        targetId: 'member-2',
        description: '配偶关系'
      };

      // 添加关系
      const updatedTree = addRelationshipToMember(familyTree, 'member-1', relationship);

      // 验证member-1的关系是否添加成功
      const member1 = updatedTree.members.find(m => m.id === 'member-1');
      expect(member1?.relationships?.length).toBe(1);
      expect(member1?.relationships?.[0].type).toBe(RelationType.SPOUSE);
      expect(member1?.relationships?.[0].targetId).toBe('member-2');

      // 验证member-2的关系是否自动添加（双向关系）
      const member2 = updatedTree.members.find(m => m.id === 'member-2');
      expect(member2?.relationships?.length).toBe(1);
      expect(member2?.relationships?.[0].type).toBe(RelationType.SPOUSE);
      expect(member2?.relationships?.[0].targetId).toBe('member-1');
    });

    it('应该添加子女关系并在目标成员上添加父母关系', () => {
      // 创建测试家谱
      const familyTree: FamilyTree = {
        members: [
          { id: 'parent-1', name: '父亲', relation: '父亲' },
          { id: 'child-1', name: '儿子', relation: '儿子' }
        ],
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z'
      };

      // 创建子女关系
      const relationship: Relationship = {
        type: RelationType.CHILD,
        targetId: 'child-1',
        description: '子女关系'
      };

      // 添加关系
      const updatedTree = addRelationshipToMember(familyTree, 'parent-1', relationship);

      // 验证父亲的关系是否添加成功
      const parentMember = updatedTree.members.find(m => m.id === 'parent-1');
      expect(parentMember?.relationships?.length).toBe(1);
      expect(parentMember?.relationships?.[0].type).toBe(RelationType.CHILD);
      expect(parentMember?.relationships?.[0].targetId).toBe('child-1');

      // 验证子女的关系是否自动添加
      const childMember = updatedTree.members.find(m => m.id === 'child-1');
      expect(childMember?.relationships?.length).toBe(1);
      expect(childMember?.relationships?.[0].type).toBe(RelationType.PARENT);
      expect(childMember?.relationships?.[0].targetId).toBe('parent-1');
      expect(childMember?.parentId).toBe('parent-1'); // 验证parentId也被设置
    });

    it('当成员不存在时应该抛出错误', () => {
      // 创建测试家谱
      const familyTree: FamilyTree = {
        members: [
          { id: 'member-1', name: '成员1', relation: '父亲' }
        ],
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z'
      };

      // 创建关系
      const relationship: Relationship = {
        type: RelationType.PARENT,
        targetId: 'member-1',
        description: '父亲关系'
      };

      // 尝试为不存在的成员添加关系
      expect(() => {
        addRelationshipToMember(familyTree, 'non-existent-id', relationship);
      }).toThrow('Member with ID non-existent-id not found');
    });

    it('应该更新已存在的关系', () => {
      // 创建测试家谱，成员已有关系
      const familyTree: FamilyTree = {
        members: [
          { id: 'parent-1', name: '父亲', relation: '父亲' },
          {
            id: 'child-1',
            name: '儿子',
            relation: '儿子',
            relationships: [
              { type: RelationType.PARENT, targetId: 'parent-1', description: '原始描述' }
            ]
          }
        ],
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z'
      };

      // 创建更新后的关系
      const updatedRelationship: Relationship = {
        type: RelationType.PARENT,
        targetId: 'parent-1',
        description: '更新后的描述'
      };

      // 更新关系
      const updatedTree = addRelationshipToMember(familyTree, 'child-1', updatedRelationship);

      // 验证关系是否更新成功
      const childMember = updatedTree.members.find(m => m.id === 'child-1');
      expect(childMember?.relationships?.length).toBe(1);
      expect(childMember?.relationships?.[0].description).toBe('更新后的描述');
    });
  });

  describe('removeRelationship', () => {
    it('应该移除父子关系', () => {
      // 创建测试家谱，成员已有父子关系
      const familyTree: FamilyTree = {
        members: [
          { id: 'parent-1', name: '父亲', relation: '父亲' },
          {
            id: 'child-1',
            name: '儿子',
            relation: '儿子',
            parentId: 'parent-1',
            relationships: [
              { type: RelationType.PARENT, targetId: 'parent-1', description: '父亲关系' }
            ]
          }
        ],
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z'
      };

      // 移除关系
      const updatedTree = removeRelationship(familyTree, 'child-1', 'parent-1', RelationType.PARENT);

      // 验证关系是否移除成功
      const childMember = updatedTree.members.find(m => m.id === 'child-1');
      expect(childMember?.relationships?.length).toBe(0);
      expect(childMember?.parentId).toBeUndefined(); // 验证parentId也被移除

      // 验证updatedAt是否更新
      expect(updatedTree.updatedAt).not.toBe(familyTree.updatedAt);
    });

    it('应该移除配偶关系（双向关系）', () => {
      // 创建测试家谱，成员已有配偶关系
      const familyTree: FamilyTree = {
        members: [
          {
            id: 'member-1',
            name: '丈夫',
            relation: '丈夫',
            relationships: [
              { type: RelationType.SPOUSE, targetId: 'member-2', description: '配偶关系' }
            ]
          },
          {
            id: 'member-2',
            name: '妻子',
            relation: '妻子',
            relationships: [
              { type: RelationType.SPOUSE, targetId: 'member-1', description: '配偶关系' }
            ]
          }
        ],
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z'
      };

      // 移除关系
      const updatedTree = removeRelationship(familyTree, 'member-1', 'member-2', RelationType.SPOUSE);

      // 验证member-1的关系是否移除成功
      const member1 = updatedTree.members.find(m => m.id === 'member-1');
      expect(member1?.relationships?.length).toBe(0);

      // 验证member-2的关系是否自动移除（双向关系）
      const member2 = updatedTree.members.find(m => m.id === 'member-2');
      expect(member2?.relationships?.length).toBe(0);
    });

    it('应该移除子女关系并在目标成员上移除父母关系', () => {
      // 创建测试家谱，成员已有子女关系
      const familyTree: FamilyTree = {
        members: [
          {
            id: 'parent-1',
            name: '父亲',
            relation: '父亲',
            relationships: [
              { type: RelationType.CHILD, targetId: 'child-1', description: '子女关系' }
            ]
          },
          {
            id: 'child-1',
            name: '儿子',
            relation: '儿子',
            parentId: 'parent-1',
            relationships: [
              { type: RelationType.PARENT, targetId: 'parent-1', description: '父亲关系' }
            ]
          }
        ],
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z'
      };

      // 移除关系
      const updatedTree = removeRelationship(familyTree, 'parent-1', 'child-1', RelationType.CHILD);

      // 验证父亲的关系是否移除成功
      const parentMember = updatedTree.members.find(m => m.id === 'parent-1');
      expect(parentMember?.relationships?.length).toBe(0);

      // 验证子女的关系是否自动移除
      const childMember = updatedTree.members.find(m => m.id === 'child-1');
      expect(childMember?.relationships?.length).toBe(0);
      expect(childMember?.parentId).toBeUndefined(); // 验证parentId也被移除
    });

    it('当成员不存在时应该抛出错误', () => {
      // 创建测试家谱
      const familyTree: FamilyTree = {
        members: [
          { id: 'member-1', name: '成员1', relation: '父亲' }
        ],
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z'
      };

      // 尝试为不存在的成员移除关系
      expect(() => {
        removeRelationship(familyTree, 'non-existent-id', 'member-1', RelationType.PARENT);
      }).toThrow('Member with ID non-existent-id not found');
    });

    it('当成员没有关系时应该直接返回原家谱', () => {
      // 创建测试家谱，成员没有关系
      const familyTree: FamilyTree = {
        members: [
          { id: 'member-1', name: '成员1', relation: '父亲' },
          { id: 'member-2', name: '成员2', relation: '儿子' }
        ],
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z'
      };

      // 尝试移除不存在的关系
      const updatedTree = removeRelationship(familyTree, 'member-1', 'member-2', RelationType.PARENT);

      // 验证家谱没有变化
      expect(updatedTree).toEqual(familyTree);
    });
  });
});
