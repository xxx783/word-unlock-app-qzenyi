
import { WordCategory } from '../types';

export const wordCategories: WordCategory[] = [
  {
    id: 'basic-animals',
    name: '基础动物词汇',
    description: '学习常见动物的英文单词',
    icon: '🐾',
    order: 1,
    words: [
      {
        id: 'cat',
        word: 'cat',
        definition: '猫',
        example: 'The cat is sleeping on the sofa.',
        difficulty: 'easy'
      },
      {
        id: 'dog',
        word: 'dog',
        definition: '狗',
        example: 'My dog loves to play fetch.',
        difficulty: 'easy'
      },
      {
        id: 'bird',
        word: 'bird',
        definition: '鸟',
        example: 'The bird is singing in the tree.',
        difficulty: 'easy'
      },
      {
        id: 'fish',
        word: 'fish',
        definition: '鱼',
        example: 'We saw colorful fish in the aquarium.',
        difficulty: 'easy'
      },
      {
        id: 'elephant',
        word: 'elephant',
        definition: '大象',
        example: 'The elephant has a long trunk.',
        difficulty: 'medium'
      }
    ]
  },
  {
    id: 'basic-colors',
    name: '基础颜色词汇',
    description: '学习基本颜色的英文表达',
    icon: '🎨',
    order: 2,
    requiredCategory: 'basic-animals',
    words: [
      {
        id: 'red',
        word: 'red',
        definition: '红色',
        example: 'The apple is red.',
        difficulty: 'easy'
      },
      {
        id: 'blue',
        word: 'blue',
        definition: '蓝色',
        example: 'The sky is blue today.',
        difficulty: 'easy'
      },
      {
        id: 'green',
        word: 'green',
        definition: '绿色',
        example: 'The grass is green.',
        difficulty: 'easy'
      },
      {
        id: 'yellow',
        word: 'yellow',
        definition: '黄色',
        example: 'The sun looks yellow.',
        difficulty: 'easy'
      },
      {
        id: 'purple',
        word: 'purple',
        definition: '紫色',
        example: 'She wore a purple dress.',
        difficulty: 'medium'
      }
    ]
  },
  {
    id: 'basic-food',
    name: '基础食物词汇',
    description: '学习常见食物的英文单词',
    icon: '🍎',
    order: 3,
    requiredCategory: 'basic-colors',
    words: [
      {
        id: 'apple',
        word: 'apple',
        definition: '苹果',
        example: 'I eat an apple every day.',
        difficulty: 'easy'
      },
      {
        id: 'bread',
        word: 'bread',
        definition: '面包',
        example: 'We buy fresh bread from the bakery.',
        difficulty: 'easy'
      },
      {
        id: 'water',
        word: 'water',
        definition: '水',
        example: 'Please drink more water.',
        difficulty: 'easy'
      },
      {
        id: 'chicken',
        word: 'chicken',
        definition: '鸡肉',
        example: 'We had chicken for dinner.',
        difficulty: 'medium'
      },
      {
        id: 'vegetable',
        word: 'vegetable',
        definition: '蔬菜',
        example: 'Eating vegetables is good for health.',
        difficulty: 'medium'
      }
    ]
  },
  {
    id: 'family-members',
    name: '家庭成员词汇',
    description: '学习家庭成员的英文称呼',
    icon: '👨‍👩‍👧‍👦',
    order: 4,
    requiredCategory: 'basic-food',
    words: [
      {
        id: 'mother',
        word: 'mother',
        definition: '母亲',
        example: 'My mother cooks delicious food.',
        difficulty: 'easy'
      },
      {
        id: 'father',
        word: 'father',
        definition: '父亲',
        example: 'My father works in an office.',
        difficulty: 'easy'
      },
      {
        id: 'sister',
        word: 'sister',
        definition: '姐妹',
        example: 'My sister is younger than me.',
        difficulty: 'easy'
      },
      {
        id: 'brother',
        word: 'brother',
        definition: '兄弟',
        example: 'My brother plays basketball.',
        difficulty: 'easy'
      },
      {
        id: 'grandmother',
        word: 'grandmother',
        definition: '祖母',
        example: 'My grandmother tells great stories.',
        difficulty: 'medium'
      }
    ]
  }
];
