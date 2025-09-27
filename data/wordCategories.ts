
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
        pronunciation: '/kæt/',
        difficulty: 'easy',
        image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop',
        audioUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/cat--_us_1.mp3'
      },
      {
        id: 'dog',
        word: 'dog',
        definition: '狗',
        example: 'My dog loves to play fetch.',
        pronunciation: '/dɔːɡ/',
        difficulty: 'easy',
        image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop',
        audioUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/dog--_us_1.mp3'
      },
      {
        id: 'bird',
        word: 'bird',
        definition: '鸟',
        example: 'The bird is singing in the tree.',
        pronunciation: '/bɜːrd/',
        difficulty: 'easy',
        image: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400&h=300&fit=crop',
        audioUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/bird--_us_1.mp3'
      },
      {
        id: 'fish',
        word: 'fish',
        definition: '鱼',
        example: 'We saw colorful fish in the aquarium.',
        pronunciation: '/fɪʃ/',
        difficulty: 'easy',
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
        audioUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/fish--_us_1.mp3'
      },
      {
        id: 'elephant',
        word: 'elephant',
        definition: '大象',
        example: 'The elephant has a long trunk.',
        pronunciation: '/ˈeləfənt/',
        difficulty: 'medium',
        image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=400&h=300&fit=crop',
        audioUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/elephant--_us_1.mp3'
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
        pronunciation: '/red/',
        difficulty: 'easy',
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
        audioUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/red--_us_1.mp3'
      },
      {
        id: 'blue',
        word: 'blue',
        definition: '蓝色',
        example: 'The sky is blue today.',
        pronunciation: '/bluː/',
        difficulty: 'easy',
        image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=300&fit=crop',
        audioUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/blue--_us_1.mp3'
      },
      {
        id: 'green',
        word: 'green',
        definition: '绿色',
        example: 'The grass is green.',
        pronunciation: '/ɡriːn/',
        difficulty: 'easy',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
        audioUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/green--_us_1.mp3'
      },
      {
        id: 'yellow',
        word: 'yellow',
        definition: '黄色',
        example: 'The sun looks yellow.',
        pronunciation: '/ˈjeloʊ/',
        difficulty: 'easy',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
        audioUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/yellow--_us_1.mp3'
      },
      {
        id: 'purple',
        word: 'purple',
        definition: '紫色',
        example: 'She wore a purple dress.',
        pronunciation: '/ˈpɜːrpəl/',
        difficulty: 'medium',
        image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop',
        audioUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/purple--_us_1.mp3'
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
        pronunciation: '/ˈæpəl/',
        difficulty: 'easy',
        image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop',
        audioUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/apple--_us_1.mp3'
      },
      {
        id: 'bread',
        word: 'bread',
        definition: '面包',
        example: 'We buy fresh bread from the bakery.',
        pronunciation: '/bred/',
        difficulty: 'easy',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',
        audioUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/bread--_us_1.mp3'
      },
      {
        id: 'water',
        word: 'water',
        definition: '水',
        example: 'Please drink more water.',
        pronunciation: '/ˈwɔːtər/',
        difficulty: 'easy',
        image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=300&fit=crop',
        audioUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/water--_us_1.mp3'
      },
      {
        id: 'chicken',
        word: 'chicken',
        definition: '鸡肉',
        example: 'We had chicken for dinner.',
        pronunciation: '/ˈtʃɪkən/',
        difficulty: 'medium',
        image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop',
        audioUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/chicken--_us_1.mp3'
      },
      {
        id: 'vegetable',
        word: 'vegetable',
        definition: '蔬菜',
        example: 'Eating vegetables is good for health.',
        pronunciation: '/ˈvedʒtəbəl/',
        difficulty: 'medium',
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop',
        audioUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/vegetable--_us_1.mp3'
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
        pronunciation: '/ˈmʌðər/',
        difficulty: 'easy',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop',
        audioUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/mother--_us_1.mp3'
      },
      {
        id: 'father',
        word: 'father',
        definition: '父亲',
        example: 'My father works in an office.',
        pronunciation: '/ˈfɑːðər/',
        difficulty: 'easy',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
        audioUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/father--_us_1.mp3'
      },
      {
        id: 'sister',
        word: 'sister',
        definition: '姐妹',
        example: 'My sister is younger than me.',
        pronunciation: '/ˈsɪstər/',
        difficulty: 'easy',
        image: 'https://images.unsplash.com/photo-1494790108755-2616c9c0b8b4?w=400&h=300&fit=crop',
        audioUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/sister--_us_1.mp3'
      },
      {
        id: 'brother',
        word: 'brother',
        definition: '兄弟',
        example: 'My brother plays basketball.',
        pronunciation: '/ˈbrʌðər/',
        difficulty: 'easy',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop',
        audioUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/brother--_us_1.mp3'
      },
      {
        id: 'grandmother',
        word: 'grandmother',
        definition: '祖母',
        example: 'My grandmother tells great stories.',
        pronunciation: '/ˈɡrænmʌðər/',
        difficulty: 'medium',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop',
        audioUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/grandmother--_us_1.mp3'
      }
    ]
  }
];
