import { Member } from '@/types/family-tree';

/**
 * 验证结果接口
 */
export interface ValidationResult {
  isValid: boolean;
  errors?: Record<string, string>;
  message?: string;
}

/**
 * 验证成员数据
 * @param member 成员数据
 * @returns 验证结果
 */
export function validateMember(member: Partial<Member>): ValidationResult {
  const errors: Record<string, string> = {};

  // 验证必填字段
  if (!member.name || member.name.trim() === '') {
    errors.name = 'Name is required';
  }

  if (!member.relation || member.relation.trim() === '') {
    errors.relation = 'Relation is required';
  }

  // 验证日期格式
  if (member.birthDate && !isValidDateFormat(member.birthDate)) {
    errors.birthDate = 'Invalid birth date format. Use YYYY-MM-DD or MM/DD/YYYY';
  }

  if (member.deathDate && !isValidDateFormat(member.deathDate)) {
    errors.deathDate = 'Invalid death date format. Use YYYY-MM-DD or MM/DD/YYYY';
  }

  // 验证出生日期和死亡日期的逻辑关系
  if (member.birthDate && member.deathDate && 
      new Date(member.birthDate) > new Date(member.deathDate)) {
    errors.deathDate = 'Death date cannot be earlier than birth date';
  }

  // 验证性别
  if (member.gender && !['male', 'female', 'other'].includes(member.gender)) {
    errors.gender = 'Gender must be male, female, or other';
  }

  // 验证名称长度
  if (member.name && member.name.length > 100) {
    errors.name = 'Name is too long (maximum 100 characters)';
  }

  // 验证关系长度
  if (member.relation && member.relation.length > 100) {
    errors.relation = 'Relation is too long (maximum 100 characters)';
  }

  // 验证描述长度
  if (member.description && member.description.length > 1000) {
    errors.description = 'Description is too long (maximum 1000 characters)';
  }

  // 检查XSS风险
  if (member.name && containsHtmlTags(member.name)) {
    errors.name = 'Name cannot contain HTML tags';
  }

  if (member.relation && containsHtmlTags(member.relation)) {
    errors.relation = 'Relation cannot contain HTML tags';
  }

  if (member.description && containsHtmlTags(member.description)) {
    errors.description = 'Description cannot contain HTML tags';
  }

  // 返回验证结果
  const isValid = Object.keys(errors).length === 0;
  return {
    isValid,
    errors: isValid ? undefined : errors,
    message: isValid ? undefined : 'Member data validation failed'
  };
}

/**
 * 验证日期格式
 * @param dateString 日期字符串
 * @returns 是否为有效日期格式
 */
function isValidDateFormat(dateString: string): boolean {
  // 支持的格式：YYYY-MM-DD 或 MM/DD/YYYY
  const isoPattern = /^\d{4}-\d{2}-\d{2}$/;
  const usPattern = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
  
  if (isoPattern.test(dateString) || usPattern.test(dateString)) {
    // 进一步验证日期是否有效
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }
  
  return false;
}

/**
 * 检查字符串是否包含HTML标签
 * @param value 要检查的字符串
 * @returns 是否包含HTML标签
 */
function containsHtmlTags(value: string): boolean {
  const htmlTagPattern = /<[^>]*>/;
  return htmlTagPattern.test(value);
}

/**
 * 清理输入数据，防止XSS攻击
 * @param value 要清理的字符串
 * @returns 清理后的字符串
 */
export function sanitizeInput(value: string): string {
  if (!value) return value;
  
  // 替换HTML标签和特殊字符
  return value
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * 清理成员数据
 * @param member 成员数据
 * @returns 清理后的成员数据
 */
export function sanitizeMember(member: Partial<Member>): Partial<Member> {
  const sanitized: Partial<Member> = { ...member };
  
  if (sanitized.name) {
    sanitized.name = sanitizeInput(sanitized.name);
  }
  
  if (sanitized.relation) {
    sanitized.relation = sanitizeInput(sanitized.relation);
  }
  
  if (sanitized.description) {
    sanitized.description = sanitizeInput(sanitized.description);
  }
  
  return sanitized;
}
