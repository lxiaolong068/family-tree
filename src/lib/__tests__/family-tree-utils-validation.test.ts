import { addRelationshipToMember, addRelationshipsToMember } from '../family-tree-utils';
import { FamilyTree, Member, RelationType } from '@/types/family-tree';

describe('家谱工具函数验证测试', () => {
  // 测试用的家谱数据
  const createTestFamilyTree = (): FamilyTree => {
    const members: Member[] = [
      {
        id: 'member1',
        name: '父亲',
        relation: '父亲',
        gender: 'male',
        relationships: [
          { type: RelationType.SPOUSE, targetId: 'member2' },
          { type: RelationType.CHILD, targetId: 'member3' },
          { type: RelationType.CHILD, targetId: 'member4' }
        ]
      },
      {
        id: 'member2',
        name: '母亲',
        relation: '母亲',
        gender: 'female',
        relationships: [
          { type: RelationType.SPOUSE, targetId: 'member1' },
          { type: RelationType.CHILD, targetId: 'member3' },
          { type: RelationType.CHILD, targetId: 'member4' }
        ]
      },
      {
        id: 'member3',
        name: '儿子',
        relation: '儿子',
        gender: 'male',
        relationships: [
          { type: RelationType.PARENT, targetId: 'member1' },
          { type: RelationType.PARENT, targetId: 'member2' },
          { type: RelationType.SIBLING, targetId: 'member4' }
        ]
      },
      {
        id: 'member4',
        name: '女儿',
        relation: '女儿',
        gender: 'female',
        relationships: [
          { type: RelationType.PARENT, targetId: 'member1' },
          { type: RelationType.PARENT, targetId: 'member2' },
          { type: RelationType.SIBLING, targetId: 'member3' }
        ]
      }
    ];

    return {
      members,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  };

  describe('addRelationshipToMember', () => {
    it('应该检测到自引用关系冲突', () => {
      const familyTree = createTestFamilyTree();
      const result = addRelationshipToMember(
        familyTree,
        'member1',
        { type: RelationType.PARENT, targetId: 'member1' }
      );

      expect(result.conflict).toBeDefined();
      expect(result.conflict?.type).toBe('self_reference');
      expect(result.familyTree).toEqual(familyTree); // 家谱应该保持不变
    });

    it('应该检测到重复关系冲突', () => {
      const familyTree = createTestFamilyTree();
      const result = addRelationshipToMember(
        familyTree,
        'member1',
        { type: RelationType.SPOUSE, targetId: 'member2' }
      );

      expect(result.conflict).toBeDefined();
      expect(result.conflict?.type).toBe('duplicate');
      expect(result.familyTree).toEqual(familyTree); // 家谱应该保持不变
    });

    it('应该检测到角色冲突', () => {
      const familyTree = createTestFamilyTree();
      const result = addRelationshipToMember(
        familyTree,
        'member1',
        { type: RelationType.PARENT, targetId: 'member3' }
      );

      expect(result.conflict).toBeDefined();
      expect(result.conflict?.type).toBe('role_conflict');
      expect(result.familyTree).toEqual(familyTree); // 家谱应该保持不变
    });

    it('应该成功添加有效关系', () => {
      const familyTree = createTestFamilyTree();
      
      // 添加一个新成员
      const newMember: Member = {
        id: 'member5',
        name: '新成员',
        relation: '朋友',
        gender: 'male',
        relationships: []
      };
      
      familyTree.members.push(newMember);
      
      // 添加一个有效的关系
      const result = addRelationshipToMember(
        familyTree,
        'member3',
        { type: RelationType.SPOUSE, targetId: 'member5' }
      );

      expect(result.conflict).toBeUndefined();
      expect(result.familyTree).not.toEqual(familyTree); // 家谱应该已更新
      
      // 验证关系是否已添加
      const updatedMember = result.familyTree.members.find(m => m.id === 'member3');
      expect(updatedMember?.relationships).toContainEqual({
        type: RelationType.SPOUSE,
        targetId: 'member5'
      });
      
      // 验证双向关系是否已添加
      const targetMember = result.familyTree.members.find(m => m.id === 'member5');
      expect(targetMember?.relationships).toContainEqual({
        type: RelationType.SPOUSE,
        targetId: 'member3'
      });
    });
  });

  describe('addRelationshipsToMember', () => {
    it('应该批量添加关系并收集冲突', () => {
      const familyTree = createTestFamilyTree();
      
      // 添加一个新成员
      const newMember: Member = {
        id: 'member5',
        name: '新成员',
        relation: '朋友',
        gender: 'male',
        relationships: []
      };
      
      familyTree.members.push(newMember);
      
      // 尝试添加多个关系，其中一些会冲突
      const relationships = [
        { type: RelationType.SPOUSE, targetId: 'member2' }, // 冲突：重复关系
        { type: RelationType.SPOUSE, targetId: 'member5' }, // 有效
        { type: RelationType.PARENT, targetId: 'member1' }  // 冲突：角色冲突
      ];
      
      const result = addRelationshipsToMember(familyTree, 'member1', relationships);
      
      // 应该有两个冲突
      expect(result.conflicts).toBeDefined();
      expect(result.conflicts?.length).toBe(2);
      
      // 验证有效关系是否已添加
      const updatedMember = result.familyTree.members.find(m => m.id === 'member1');
      expect(updatedMember?.relationships).toContainEqual({
        type: RelationType.SPOUSE,
        targetId: 'member5'
      });
      
      // 验证双向关系是否已添加
      const targetMember = result.familyTree.members.find(m => m.id === 'member5');
      expect(targetMember?.relationships).toContainEqual({
        type: RelationType.SPOUSE,
        targetId: 'member1'
      });
    });
  });
});
