# 家谱关系可视化优化测试文档

## 优化目标

1. 使用不同颜色和线型区分不同类型的关系
2. 在关系线上显示关系描述和类型
3. 优化关系图布局算法，更好地处理复杂家族结构
4. 添加性别特定的节点样式和根节点特殊标记
5. 添加出生和死亡日期显示

## 测试用例

### 测试用例1：基本关系显示

**输入**：
```typescript
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
      { type: RelationType.PARENT, targetId: '2' }
    ]
  }
];
```

**预期输出**：
- 父亲节点使用男性特定样式（蓝色填充，矩形形状）
- 母亲节点使用女性特定样式（粉色填充，圆形形状）
- 父亲和母亲之间的配偶关系使用粉色虚线
- 父母到儿子的关系使用绿色实线
- 关系线上显示关系类型（"Parent"、"Child"、"Spouse"）

### 测试用例2：关系描述显示

**输入**：
```typescript
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
```

**预期输出**：
- 父亲和母亲之间的配偶关系线上显示"Spouse: 结婚20年"
- 父亲到儿子的关系线上显示"Child: 长子"

### 测试用例3：出生和死亡日期显示

**输入**：
```typescript
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
```

**预期输出**：
- 祖父节点显示名称和日期信息："祖父\nb. 1920-01-01 - d. 2000-12-31"

### 测试用例4：复杂家族结构

**输入**：
```typescript
const members: Member[] = [
  // 祖父母一代
  { id: '1', name: '祖父', relation: '祖父', gender: 'male', relationships: [
    { type: RelationType.SPOUSE, targetId: '2' },
    { type: RelationType.CHILD, targetId: '3' },
    { type: RelationType.CHILD, targetId: '4' }
  ]},
  { id: '2', name: '祖母', relation: '祖母', gender: 'female' },
  
  // 父母一代
  { id: '3', name: '父亲', relation: '父亲', gender: 'male', relationships: [
    { type: RelationType.SPOUSE, targetId: '5' },
    { type: RelationType.CHILD, targetId: '7' },
    { type: RelationType.CHILD, targetId: '8' }
  ]},
  { id: '4', name: '叔叔', relation: '叔叔', gender: 'male', relationships: [
    { type: RelationType.SPOUSE, targetId: '6' },
    { type: RelationType.CHILD, targetId: '9' }
  ]},
  { id: '5', name: '母亲', relation: '母亲', gender: 'female' },
  { id: '6', name: '婶婶', relation: '婶婶', gender: 'female' },
  
  // 子女一代
  { id: '7', name: '儿子', relation: '儿子', gender: 'male', relationships: [
    { type: RelationType.SIBLING, targetId: '8' },
    { type: RelationType.SIBLING, targetId: '9', description: '堂兄弟' }
  ]},
  { id: '8', name: '女儿', relation: '女儿', gender: 'female' },
  { id: '9', name: '堂兄', relation: '堂兄', gender: 'male' }
];
```

**预期输出**：
- 三代家族结构清晰可见
- 兄弟姐妹关系使用紫色点线
- 堂兄弟关系线上显示"Sibling: 堂兄弟"
- 根节点（祖父）有特殊标记

## 测试结果

所有测试用例均通过，家谱关系可视化优化已成功实现。

## 后续改进方向

1. 添加更多的关系类型和样式
2. 支持自定义关系颜色和样式
3. 添加关系图的缩放和平移功能
4. 优化大型家谱的性能
5. 添加关系图的导出功能（PNG、PDF等）
