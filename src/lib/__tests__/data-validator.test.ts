import { validateMember, sanitizeInput, sanitizeMember } from '../data-validator';
import { Member } from '@/types/family-tree';

describe('数据验证工具测试', () => {
  describe('validateMember', () => {
    it('应该验证必填字段', () => {
      // 空成员
      const emptyMember: Partial<Member> = {};
      const emptyResult = validateMember(emptyMember);
      
      expect(emptyResult.isValid).toBe(false);
      expect(emptyResult.errors).toHaveProperty('name');
      expect(emptyResult.errors).toHaveProperty('relation');
      
      // 只有名称
      const nameOnlyMember: Partial<Member> = { name: 'John' };
      const nameOnlyResult = validateMember(nameOnlyMember);
      
      expect(nameOnlyResult.isValid).toBe(false);
      expect(nameOnlyResult.errors).toHaveProperty('relation');
      expect(nameOnlyResult.errors).not.toHaveProperty('name');
      
      // 只有关系
      const relationOnlyMember: Partial<Member> = { relation: 'Father' };
      const relationOnlyResult = validateMember(relationOnlyMember);
      
      expect(relationOnlyResult.isValid).toBe(false);
      expect(relationOnlyResult.errors).toHaveProperty('name');
      expect(relationOnlyResult.errors).not.toHaveProperty('relation');
      
      // 有效成员
      const validMember: Partial<Member> = { name: 'John', relation: 'Father' };
      const validResult = validateMember(validMember);
      
      expect(validResult.isValid).toBe(true);
      expect(validResult.errors).toBeUndefined();
    });
    
    it('应该验证日期格式', () => {
      // 无效的出生日期
      const invalidBirthDate: Partial<Member> = { 
        name: 'John', 
        relation: 'Father',
        birthDate: 'invalid-date' 
      };
      const invalidBirthResult = validateMember(invalidBirthDate);
      
      expect(invalidBirthResult.isValid).toBe(false);
      expect(invalidBirthResult.errors).toHaveProperty('birthDate');
      
      // 无效的死亡日期
      const invalidDeathDate: Partial<Member> = { 
        name: 'John', 
        relation: 'Father',
        deathDate: 'invalid-date' 
      };
      const invalidDeathResult = validateMember(invalidDeathDate);
      
      expect(invalidDeathResult.isValid).toBe(false);
      expect(invalidDeathResult.errors).toHaveProperty('deathDate');
      
      // 有效的ISO日期格式
      const validIsoDate: Partial<Member> = { 
        name: 'John', 
        relation: 'Father',
        birthDate: '2000-01-01',
        deathDate: '2080-12-31'
      };
      const validIsoResult = validateMember(validIsoDate);
      
      expect(validIsoResult.isValid).toBe(true);
      expect(validIsoResult.errors).toBeUndefined();
      
      // 有效的US日期格式
      const validUsDate: Partial<Member> = { 
        name: 'John', 
        relation: 'Father',
        birthDate: '01/01/2000',
        deathDate: '12/31/2080'
      };
      const validUsResult = validateMember(validUsDate);
      
      expect(validUsResult.isValid).toBe(true);
      expect(validUsResult.errors).toBeUndefined();
    });
    
    it('应该验证日期逻辑关系', () => {
      // 死亡日期早于出生日期
      const invalidDateLogic: Partial<Member> = { 
        name: 'John', 
        relation: 'Father',
        birthDate: '2000-01-01',
        deathDate: '1999-12-31'
      };
      const invalidLogicResult = validateMember(invalidDateLogic);
      
      expect(invalidLogicResult.isValid).toBe(false);
      expect(invalidLogicResult.errors).toHaveProperty('deathDate');
      
      // 有效的日期逻辑
      const validDateLogic: Partial<Member> = { 
        name: 'John', 
        relation: 'Father',
        birthDate: '2000-01-01',
        deathDate: '2080-12-31'
      };
      const validLogicResult = validateMember(validDateLogic);
      
      expect(validLogicResult.isValid).toBe(true);
      expect(validLogicResult.errors).toBeUndefined();
    });
    
    it('应该验证性别', () => {
      // 无效的性别
      const invalidGender: Partial<Member> = { 
        name: 'John', 
        relation: 'Father',
        gender: 'invalid' as any
      };
      const invalidGenderResult = validateMember(invalidGender);
      
      expect(invalidGenderResult.isValid).toBe(false);
      expect(invalidGenderResult.errors).toHaveProperty('gender');
      
      // 有效的性别
      const validGenders = ['male', 'female', 'other'];
      
      validGenders.forEach(gender => {
        const validGender: Partial<Member> = { 
          name: 'John', 
          relation: 'Father',
          gender: gender as any
        };
        const validGenderResult = validateMember(validGender);
        
        expect(validGenderResult.isValid).toBe(true);
        expect(validGenderResult.errors).toBeUndefined();
      });
    });
    
    it('应该检测XSS风险', () => {
      // 名称中包含HTML标签
      const xssName: Partial<Member> = { 
        name: '<script>alert("XSS")</script>John', 
        relation: 'Father'
      };
      const xssNameResult = validateMember(xssName);
      
      expect(xssNameResult.isValid).toBe(false);
      expect(xssNameResult.errors).toHaveProperty('name');
      
      // 关系中包含HTML标签
      const xssRelation: Partial<Member> = { 
        name: 'John', 
        relation: '<img src="x" onerror="alert(\'XSS\')">Father'
      };
      const xssRelationResult = validateMember(xssRelation);
      
      expect(xssRelationResult.isValid).toBe(false);
      expect(xssRelationResult.errors).toHaveProperty('relation');
      
      // 描述中包含HTML标签
      const xssDescription: Partial<Member> = { 
        name: 'John', 
        relation: 'Father',
        description: '<div onclick="alert(\'XSS\')">Description</div>'
      };
      const xssDescriptionResult = validateMember(xssDescription);
      
      expect(xssDescriptionResult.isValid).toBe(false);
      expect(xssDescriptionResult.errors).toHaveProperty('description');
    });
  });
  
  describe('sanitizeInput', () => {
    it('应该清理HTML标签和特殊字符', () => {
      const inputs = [
        '<script>alert("XSS")</script>',
        '<img src="x" onerror="alert(\'XSS\')">',
        '<div onclick="alert(\'XSS\')">Text</div>',
        'Text with <b>bold</b> and <i>italic</i>',
        'Text with "quotes" and \'apostrophes\''
      ];
      
      const expected = [
        '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;',
        '&lt;img src=&quot;x&quot; onerror=&quot;alert(&#39;XSS&#39;)&quot;&gt;',
        '&lt;div onclick=&quot;alert(&#39;XSS&#39;)&quot;&gt;Text&lt;/div&gt;',
        'Text with &lt;b&gt;bold&lt;/b&gt; and &lt;i&gt;italic&lt;/i&gt;',
        'Text with &quot;quotes&quot; and &#39;apostrophes&#39;'
      ];
      
      inputs.forEach((input, index) => {
        expect(sanitizeInput(input)).toBe(expected[index]);
      });
    });
    
    it('应该处理空值', () => {
      expect(sanitizeInput('')).toBe('');
      expect(sanitizeInput(undefined as any)).toBeUndefined();
      expect(sanitizeInput(null as any)).toBeNull();
    });
  });
  
  describe('sanitizeMember', () => {
    it('应该清理成员数据', () => {
      const member: Partial<Member> = {
        name: '<b>John</b>',
        relation: '<i>Father</i>',
        description: '<script>alert("XSS")</script>Description',
        gender: 'male',
        birthDate: '2000-01-01'
      };
      
      const sanitized = sanitizeMember(member);
      
      expect(sanitized.name).toBe('&lt;b&gt;John&lt;/b&gt;');
      expect(sanitized.relation).toBe('&lt;i&gt;Father&lt;/i&gt;');
      expect(sanitized.description).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;Description');
      expect(sanitized.gender).toBe('male');
      expect(sanitized.birthDate).toBe('2000-01-01');
    });
  });
});
