import { generateMermaidChart, getRelationshipLabel } from '../family-tree-utils';
import { Member, RelationType } from '@/types/family-tree';

describe('家谱可视化测试', () => {
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
      expect(chart).toContain('1 -->|Parent| 2');
      expect(chart).toContain('class 1 male');
      expect(chart).toContain('class 2 male');
    });

    it('应该正确处理不同类型的关系', () => {
      const members: Member[] = [
        { 
          id: '1', 
          name: '父亲', 
          relation: '父亲', 
          gender: 'male',
          relationships: [
            { type: RelationType.SPOUSE, targetId: '2' },
            { type: RelationType.CHILD, targetId: '3' }
          ]
        },
        { 
          id: '2', 
          name: '母亲', 
          relation: '母亲', 
          gender: 'female',
          relationships: [
            { type: RelationType.SPOUSE, targetId: '1' },
            { type: RelationType.CHILD, targetId: '3' }
          ]
        },
        { 
          id: '3', 
          name: '儿子', 
          relation: '儿子', 
          gender: 'male',
          relationships: [
            { type: RelationType.PARENT, targetId: '1' },
            { type: RelationType.PARENT, targetId: '2' },
            { type: RelationType.SIBLING, targetId: '4' }
          ]
        },
        { 
          id: '4', 
          name: '女儿', 
          relation: '女儿', 
          gender: 'female',
          relationships: [
            { type: RelationType.PARENT, targetId: '1' },
            { type: RelationType.PARENT, targetId: '2' },
            { type: RelationType.SIBLING, targetId: '3' }
          ]
        }
      ];

      const chart = generateMermaidChart(members);
      
      // 检查节点定义
      expect(chart).toContain('1([父亲])');
      expect(chart).toContain('2((母亲))');
      expect(chart).toContain('3([儿子])');
      expect(chart).toContain('4((女儿))');
      
      // 检查关系连接
      expect(chart).toContain('1 -..-');  // 配偶关系
      expect(chart).toContain('1 -->');   // 父子关系
      expect(chart).toContain('3 -.-');   // 兄弟姐妹关系
      
      // 检查样式定义
      expect(chart).toContain('classDef male');
      expect(chart).toContain('classDef female');
      expect(chart).toContain('linkStyle');
    });

    it('应该正确处理关系描述', () => {
      const members: Member[] = [
        { 
          id: '1', 
          name: '父亲', 
          relation: '父亲', 
          gender: 'male',
          relationships: [
            { type: RelationType.SPOUSE, targetId: '2', description: '结婚20年' },
            { type: RelationType.CHILD, targetId: '3', description: '长子' }
          ]
        },
        { id: '2', name: '母亲', relation: '母亲', gender: 'female' },
        { id: '3', name: '儿子', relation: '儿子', gender: 'male' }
      ];

      const chart = generateMermaidChart(members);
      
      // 检查关系描述
      expect(chart).toContain('Spouse: 结婚20年');
      expect(chart).toContain('Child: 长子');
    });

    it('应该正确处理出生和死亡日期', () => {
      const members: Member[] = [
        { 
          id: '1', 
          name: '祖父', 
          relation: '祖父', 
          gender: 'male',
          birthDate: '1920-01-01',
          deathDate: '2000-12-31'
        }
      ];

      const chart = generateMermaidChart(members);
      
      // 检查日期显示
      expect(chart).toContain('b. 1920-01-01');
      expect(chart).toContain('d. 2000-12-31');
    });
  });

  // 测试getRelationshipLabel函数
  describe('getRelationshipLabel', () => {
    it('应该返回正确的关系标签', () => {
      // 由于getRelationshipLabel是私有函数，我们通过generateMermaidChart间接测试
      const members: Member[] = [
        { 
          id: '1', 
          name: '父亲', 
          relation: '父亲', 
          gender: 'male',
          relationships: [
            { type: RelationType.PARENT, targetId: '2' },
            { type: RelationType.CHILD, targetId: '3' },
            { type: RelationType.SPOUSE, targetId: '4' },
            { type: RelationType.SIBLING, targetId: '5' },
            { type: RelationType.OTHER, targetId: '6' }
          ]
        },
        { id: '2', name: '祖父', relation: '祖父', gender: 'male' },
        { id: '3', name: '儿子', relation: '儿子', gender: 'male' },
        { id: '4', name: '妻子', relation: '妻子', gender: 'female' },
        { id: '5', name: '兄弟', relation: '兄弟', gender: 'male' },
        { id: '6', name: '朋友', relation: '朋友', gender: 'male' }
      ];

      const chart = generateMermaidChart(members);
      
      // 检查关系标签
      expect(chart).toContain('|Parent|');
      expect(chart).toContain('|Child|');
      expect(chart).toContain('|Spouse|');
      expect(chart).toContain('|Sibling|');
      expect(chart).toContain('|Other|');
    });
  });
});
