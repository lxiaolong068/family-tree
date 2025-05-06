import { checkRelationshipConflict, RelationshipConflictType } from '../relationship-validator';
import { FamilyTree, Member, RelationType } from '@/types/family-tree';

describe('关系验证工具测试', () => {
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

  describe('自引用关系检测', () => {
    it('应该检测到自引用关系', () => {
      const familyTree = createTestFamilyTree();
      const result = checkRelationshipConflict(
        familyTree,
        'member1',
        { type: RelationType.PARENT, targetId: 'member1' }
      );

      expect(result.hasConflict).toBe(true);
      expect(result.conflictType).toBe(RelationshipConflictType.SELF_REFERENCE);
    });
  });

  describe('重复关系检测', () => {
    it('应该检测到重复关系', () => {
      const familyTree = createTestFamilyTree();
      const result = checkRelationshipConflict(
        familyTree,
        'member1',
        { type: RelationType.SPOUSE, targetId: 'member2' }
      );

      expect(result.hasConflict).toBe(true);
      expect(result.conflictType).toBe(RelationshipConflictType.DUPLICATE);
    });

    it('不同类型的关系不应该被视为重复', () => {
      const familyTree = createTestFamilyTree();
      const result = checkRelationshipConflict(
        familyTree,
        'member1',
        { type: RelationType.SIBLING, targetId: 'member2' }
      );

      expect(result.hasConflict).toBe(false);
    });
  });

  describe('角色冲突检测', () => {
    it('应该检测到父子关系冲突', () => {
      const familyTree = createTestFamilyTree();
      const result = checkRelationshipConflict(
        familyTree,
        'member1',
        { type: RelationType.PARENT, targetId: 'member3' }
      );

      expect(result.hasConflict).toBe(true);
      expect(result.conflictType).toBe(RelationshipConflictType.ROLE_CONFLICT);
    });

    it('应该检测到子父关系冲突', () => {
      const familyTree = createTestFamilyTree();
      const result = checkRelationshipConflict(
        familyTree,
        'member3',
        { type: RelationType.CHILD, targetId: 'member1' }
      );

      expect(result.hasConflict).toBe(true);
      expect(result.conflictType).toBe(RelationshipConflictType.ROLE_CONFLICT);
    });
  });

  describe('循环关系检测', () => {
    it('应该检测到循环父子关系', () => {
      // 创建一个有潜在循环的家谱
      const familyTree = createTestFamilyTree();
      
      // 尝试将孙子设为祖父的父亲，这会形成循环
      const grandchild: Member = {
        id: 'member5',
        name: '孙子',
        relation: '孙子',
        gender: 'male',
        relationships: [
          { type: RelationType.PARENT, targetId: 'member3' }
        ]
      };
      
      familyTree.members.push(grandchild);
      
      // member3是member5的父亲，现在尝试将member5设为member1的父亲
      // 这会形成循环：member1 -> member3 -> member5 -> member1
      const result = checkRelationshipConflict(
        familyTree,
        'member1',
        { type: RelationType.PARENT, targetId: 'member5' }
      );

      expect(result.hasConflict).toBe(true);
      expect(result.conflictType).toBe(RelationshipConflictType.CYCLE);
    });
  });

  describe('有效关系', () => {
    it('应该允许有效的新关系', () => {
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
      
      // 尝试添加一个有效的关系
      const result = checkRelationshipConflict(
        familyTree,
        'member3',
        { type: RelationType.SPOUSE, targetId: 'member5' }
      );

      expect(result.hasConflict).toBe(false);
    });
  });
});
