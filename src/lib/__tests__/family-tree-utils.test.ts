import { 
  generateUniqueId, 
  createNewFamilyTree, 
  generateMermaidChart,
  buildFamilyRelations,
  addMemberToFamilyTree
} from '../family-tree-utils';
import { Member } from '@/types/family-tree';

// 模拟数据库，避免测试时实际调用数据库
jest.mock('@/db', () => ({
  db: null,
  isDatabaseConfigured: jest.fn().mockReturnValue(false)
}));

describe('家谱工具函数测试', () => {
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
});
