const fs = require('fs');
const path = require('path');

// Theory modules data structure
const theoryModules = {
    'arrays-hashing': {
        id: 'arrays-hashing',
        title: 'Arrays & Hashing',
        slug: 'arrays-hashing',
        category: 'data-structures',
        difficulty: 'easy',
        description: 'Master array operations and hash table fundamentals',
        created_at: '2024-01-01',
        lessons: [
            { id: 1, title: 'Introduction to Arrays', slug: 'intro-arrays', order_index: 1, duration: '5 min' },
            { id: 2, title: 'Dynamic Arrays', slug: 'dynamic-arrays', order_index: 2, duration: '8 min' },
            { id: 3, title: 'Hash Tables Basics', slug: 'hash-basics', order_index: 3, duration: '10 min' },
            { id: 4, title: 'Collision Resolution', slug: 'collision-resolution', order_index: 4, duration: '12 min' },
            { id: 5, title: 'Common Patterns', slug: 'common-patterns', order_index: 5, duration: '15 min' }
        ]
    },
    'binary-search': {
        id: 'binary-search',
        title: 'Binary Search',
        slug: 'binary-search',
        category: 'algorithms',
        difficulty: 'easy',
        description: 'Efficient searching in sorted arrays',
        created_at: '2024-01-01',
        lessons: [
            { id: 1, title: 'Binary Search Basics', slug: 'binary-basics', order_index: 1, duration: '6 min' },
            { id: 2, title: 'Implementation Variants', slug: 'implementation-variants', order_index: 2, duration: '8 min' },
            { id: 3, title: 'Search Boundaries', slug: 'search-boundaries', order_index: 3, duration: '10 min' },
            { id: 4, title: 'Rotated Arrays', slug: 'rotated-arrays', order_index: 4, duration: '12 min' }
        ]
    },
    'linked-lists': {
        id: 'linked-lists',
        title: 'Linked Lists',
        slug: 'linked-lists',
        category: 'data-structures',
        difficulty: 'easy',
        description: 'Linear data structures with dynamic memory',
        created_at: '2024-01-01',
        lessons: [
            { id: 1, title: 'Singly Linked Lists', slug: 'singly-linked', order_index: 1, duration: '7 min' },
            { id: 2, title: 'Doubly Linked Lists', slug: 'doubly-linked', order_index: 2, duration: '9 min' },
            { id: 3, title: 'Two Pointer Techniques', slug: 'two-pointers', order_index: 3, duration: '11 min' },
            { id: 4, title: 'Cycle Detection', slug: 'cycle-detection', order_index: 4, duration: '8 min' }
        ]
    },
    'dynamic-programming': {
        id: 'dynamic-programming',
        title: 'Dynamic Programming',
        slug: 'dynamic-programming',
        category: 'algorithms',
        difficulty: 'hard',
        description: 'Optimization through memoization',
        created_at: '2024-01-01',
        lessons: [
            { id: 1, title: 'DP Fundamentals', slug: 'dp-fundamentals', order_index: 1, duration: '12 min' },
            { id: 2, title: 'Memoization', slug: 'memoization', order_index: 2, duration: '15 min' },
            { id: 3, title: 'Tabulation', slug: 'tabulation', order_index: 3, duration: '18 min' },
            { id: 4, title: 'Classic Problems', slug: 'classic-problems', order_index: 4, duration: '20 min' }
        ]
    }
};

// Lesson content data
const lessonContent = {
    'arrays-hashing-intro-arrays': {
        title: 'Introduction to Arrays',
        content_md: `# Introduction to Arrays

Arrays are fundamental data structures that store elements in contiguous memory locations. Each element can be accessed directly using its index.

## Key Properties:
- **Fixed Size:** Traditional arrays have a predetermined size
- **Homogeneous:** All elements are of the same data type  
- **Random Access:** O(1) time to access any element by index
- **Contiguous Memory:** Elements are stored in adjacent memory locations

## Time Complexities:
- **Access:** O(1)
- **Search:** O(n)
- **Insertion:** O(n) - may need to shift elements
- **Deletion:** O(n) - may need to shift elements

## Common Use Cases:
- Storing collections of similar data
- Implementing other data structures (stacks, queues)
- Mathematical operations on vectors/matrices
- Lookup tables and caching`
    },
    'arrays-hashing-dynamic-arrays': {
        title: 'Dynamic Arrays',
        content_md: `# Dynamic Arrays

Dynamic arrays automatically resize themselves when they run out of space, providing flexibility while maintaining array benefits.

## How They Work:
- **Initial Capacity:** Start with a fixed size (e.g., 4 elements)
- **Growth Strategy:** When full, create new array with 2x capacity
- **Copy Elements:** Move all existing elements to new array
- **Amortized Cost:** Occasional expensive resize, but O(1) average

## Examples in Different Languages:
- **Python:** list
- **Java:** ArrayList
- **C++:** vector
- **JavaScript:** Array

## Advantages:
- No need to specify size upfront
- Automatic memory management
- Still provides O(1) random access
- Cache-friendly due to contiguous memory`
    }
};

// File paths for data persistence
const PROGRESS_DIR = path.join(__dirname, '../../../database/codecade_db/theory_progress');
const MODULES_FILE = path.join(__dirname, '../../../database/codecade_db/theory_modules.json');
const LESSONS_FILE = path.join(__dirname, '../../../database/codecade_db/theory_lessons.json');

// Ensure directories exist
function ensureDirectories() {
    if (!fs.existsSync(PROGRESS_DIR)) {
        fs.mkdirSync(PROGRESS_DIR, { recursive: true });
    }
}

// Get user progress file path
function getUserProgressFile(username) {
    return path.join(PROGRESS_DIR, `${username}.json`);
}

// Load user progress
function loadUserProgress(username) {
    try {
        const progressFile = getUserProgressFile(username);
        if (fs.existsSync(progressFile)) {
            return JSON.parse(fs.readFileSync(progressFile, 'utf8'));
        }
    } catch (error) {
        console.error('Error loading user progress:', error);
    }
    return {};
}

// Save user progress
function saveUserProgress(username, progress) {
    try {
        ensureDirectories();
        const progressFile = getUserProgressFile(username);
        fs.writeFileSync(progressFile, JSON.stringify(progress, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving user progress:', error);
        return false;
    }
}

// Calculate module progress
function calculateModuleProgress(moduleId, userProgress) {
    const module = enhancedModules[moduleId];
    if (!module) return { completed: 0, total: 0, percentage: 0 };

    const lessons = module.lessons || [];
    const total = lessons.length;
    const completed = lessons.filter(lesson => {
        const lessonKey = `${moduleId}-${lesson.slug}`;
        return userProgress[lessonKey]?.completed || false;
    }).length;

    return {
        completed,
        total,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    };
}

// Enhanced theory modules with comprehensive DSA topics
const enhancedModules = {
    'intro-dsa': {
        id: 'intro-dsa',
        title: 'Introduction to DSA',
        slug: 'intro-dsa',
        category: 'fundamentals',
        difficulty: 'easy',
        description: 'Fundamentals of Data Structures & Algorithms',
        icon: '🎯',
        created_at: '2024-01-01',
        lessons: [
            { id: 1, title: 'What is a Data Structure?', slug: 'what-is-dsa', order_index: 1, duration: '8 min' }
        ]
    },
    'arrays': {
        id: 'arrays',
        title: 'Arrays',
        slug: 'arrays',
        category: 'data-structures',
        difficulty: 'easy',
        description: 'Collection of elements in contiguous memory',
        icon: '📊',
        created_at: '2024-01-01',
        lessons: [
            { id: 1, title: 'Array Fundamentals', slug: 'array-basics', order_index: 1, duration: '10 min' }
        ]
    },
    'linked-lists': {
        id: 'linked-lists',
        title: 'Linked Lists',
        slug: 'linked-lists',
        category: 'data-structures',
        difficulty: 'easy',
        description: 'Dynamic linear data structure with nodes',
        icon: '🔗',
        created_at: '2024-01-01',
        lessons: [
            { id: 1, title: 'Linked List Fundamentals', slug: 'linked-basics', order_index: 1, duration: '12 min' }
        ]
    },
    'stacks': {
        id: 'stacks',
        title: 'Stack',
        slug: 'stacks',
        category: 'data-structures',
        difficulty: 'easy',
        description: 'LIFO (Last In First Out) data structure',
        icon: '📚',
        created_at: '2024-01-01',
        lessons: [
            { id: 1, title: 'Stack Fundamentals', slug: 'stack-basics', order_index: 1, duration: '10 min' }
        ]
    },
    'queues': {
        id: 'queues',
        title: 'Queue',
        slug: 'queues',
        category: 'data-structures',
        difficulty: 'easy',
        description: 'FIFO (First In First Out) data structure',
        icon: '🚶',
        created_at: '2024-01-01',
        lessons: [
            { id: 1, title: 'Queue Fundamentals', slug: 'queue-basics', order_index: 1, duration: '10 min' }
        ]
    },
    'trees': {
        id: 'trees',
        title: 'Trees',
        slug: 'trees',
        category: 'data-structures',
        difficulty: 'medium',
        description: 'Hierarchical data structure with nodes and edges',
        icon: '🌳',
        created_at: '2024-01-01',
        lessons: [
            { id: 1, title: 'Tree Fundamentals', slug: 'tree-basics', order_index: 1, duration: '12 min' }
        ]
    },
    'binary-trees': {
        id: 'binary-trees',
        title: 'Binary Tree',
        slug: 'binary-trees',
        category: 'data-structures',
        difficulty: 'medium',
        description: 'Tree where each node has at most two children',
        icon: '🌲',
        created_at: '2024-01-01',
        lessons: [
            { id: 1, title: 'Binary Tree Fundamentals', slug: 'binary-tree-basics', order_index: 1, duration: '15 min' }
        ]
    },
    'bst': {
        id: 'bst',
        title: 'Binary Search Tree (BST)',
        slug: 'bst',
        category: 'data-structures',
        difficulty: 'medium',
        description: 'Binary tree with ordering property',
        icon: '🔍',
        created_at: '2024-01-01',
        lessons: [
            { id: 1, title: 'BST Fundamentals', slug: 'bst-basics', order_index: 1, duration: '15 min' }
        ]
    },
    'avl-trees': {
        id: 'avl-trees',
        title: 'AVL Tree',
        slug: 'avl-trees',
        category: 'data-structures',
        difficulty: 'hard',
        description: 'Self-balancing binary search tree',
        icon: '⚖️',
        created_at: '2024-01-01',
        lessons: [
            { id: 1, title: 'AVL Tree Fundamentals', slug: 'avl-basics', order_index: 1, duration: '20 min' }
        ]
    },
    'heaps': {
        id: 'heaps',
        title: 'Heap',
        slug: 'heaps',
        category: 'data-structures',
        difficulty: 'medium',
        description: 'Complete binary tree for priority queues',
        icon: '⛰️',
        created_at: '2024-01-01',
        lessons: [
            { id: 1, title: 'Heap Fundamentals', slug: 'heap-basics', order_index: 1, duration: '15 min' }
        ]
    },
    'graphs': {
        id: 'graphs',
        title: 'Graphs',
        slug: 'graphs',
        category: 'data-structures',
        difficulty: 'hard',
        description: 'Set of vertices connected by edges',
        icon: '🕸️',
        created_at: '2024-01-01',
        lessons: [
            { id: 1, title: 'Graph Fundamentals', slug: 'graph-basics', order_index: 1, duration: '15 min' }
        ]
    },
    'searching': {
        id: 'searching',
        title: 'Searching Algorithms',
        slug: 'searching',
        category: 'algorithms',
        difficulty: 'easy',
        description: 'Algorithms to find elements in data structures',
        icon: '🔍',
        created_at: '2024-01-01',
        lessons: [
            { id: 1, title: 'Linear Search', slug: 'linear-search', order_index: 1, duration: '8 min' }
        ]
    },
    'sorting': {
        id: 'sorting',
        title: 'Sorting Algorithms',
        slug: 'sorting',
        category: 'algorithms',
        difficulty: 'medium',
        description: 'Algorithms to arrange data in order',
        icon: '📈',
        created_at: '2024-01-01',
        lessons: [
            { id: 1, title: 'Bubble Sort', slug: 'bubble-sort', order_index: 1, duration: '10 min' }
        ]
    },
    'hashing': {
        id: 'hashing',
        title: 'Hashing',
        slug: 'hashing',
        category: 'data-structures',
        difficulty: 'medium',
        description: 'Maps keys to hash values using hash function',
        icon: '#️⃣',
        created_at: '2024-01-01',
        lessons: [
            { id: 1, title: 'Hashing Fundamentals', slug: 'hash-basics', order_index: 1, duration: '12 min' }
        ]
    },
    'recursion': {
        id: 'recursion',
        title: 'Recursion',
        slug: 'recursion',
        category: 'algorithms',
        difficulty: 'medium',
        description: 'Function calling itself until base condition',
        icon: '🔄',
        created_at: '2024-01-01',
        lessons: [
            { id: 1, title: 'Recursion Fundamentals', slug: 'recursion-basics', order_index: 1, duration: '12 min' }
        ]
    },
    'backtracking': {
        id: 'backtracking',
        title: 'Backtracking',
        slug: 'backtracking',
        category: 'algorithms',
        difficulty: 'hard',
        description: 'Try all possibilities and undo when choice fails',
        icon: '↩️',
        created_at: '2024-01-01',
        lessons: [
            { id: 1, title: 'Backtracking Fundamentals', slug: 'backtracking-basics', order_index: 1, duration: '18 min' }
        ]
    },
    'dynamic-programming': {
        id: 'dynamic-programming',
        title: 'Dynamic Programming',
        slug: 'dynamic-programming',
        category: 'algorithms',
        difficulty: 'hard',
        description: 'Optimization through memoization and tabulation',
        icon: '🧮',
        created_at: '2024-01-01',
        lessons: [
            { id: 1, title: 'DP Fundamentals', slug: 'dp-basics', order_index: 1, duration: '20 min' }
        ]
    },
    'greedy': {
        id: 'greedy',
        title: 'Greedy Algorithms',
        slug: 'greedy',
        category: 'algorithms',
        difficulty: 'medium',
        description: 'Make locally optimal choices for global optimum',
        icon: '🎯',
        created_at: '2024-01-01',
        lessons: [
            { id: 1, title: 'Greedy Strategy', slug: 'greedy-basics', order_index: 1, duration: '15 min' }
        ]
    },
    'tries': {
        id: 'tries',
        title: 'Trie (Prefix Tree)',
        slug: 'tries',
        category: 'data-structures',
        difficulty: 'medium',
        description: 'Tree-like structure for storing strings efficiently',
        icon: '🌿',
        created_at: '2024-01-01',
        lessons: [
            { id: 1, title: 'Trie Fundamentals', slug: 'trie-basics', order_index: 1, duration: '15 min' }
        ]
    },
    'segment-trees': {
        id: 'segment-trees',
        title: 'Segment Tree',
        slug: 'segment-trees',
        category: 'advanced',
        difficulty: 'hard',
        description: 'Binary tree for efficient range queries',
        icon: '🌐',
        created_at: '2024-01-01',
        lessons: [
            { id: 1, title: 'Segment Tree Fundamentals', slug: 'segment-tree-basics', order_index: 1, duration: '20 min' }
        ]
    },
    'fenwick-trees': {
        id: 'fenwick-trees',
        title: 'Fenwick Tree (BIT)',
        slug: 'fenwick-trees',
        category: 'advanced',
        difficulty: 'hard',
        description: 'Binary Indexed Tree for range sum queries',
        icon: '🔢',
        created_at: '2024-01-01',
        lessons: [
            { id: 1, title: 'Fenwick Tree Fundamentals', slug: 'fenwick-basics', order_index: 1, duration: '18 min' }
        ]
    }
};

// API Routes
const theoryRoutes = {
    // GET /api/theory/modules - Get all modules with user progress
    getModules: (req, res) => {
        try {
            const username = req.user?.username;
            const userProgress = username ? loadUserProgress(username) : {};

            const modules = Object.values(enhancedModules).map(module => {
                const progress = calculateModuleProgress(module.id, userProgress);
                return {
                    ...module,
                    progress
                };
            });

            let totalLessons = 0;
            let completedLessons = 0;
            modules.forEach(module => {
                totalLessons += module.progress.total;
                completedLessons += module.progress.completed;
            });

            res.json({
                modules,
                totalModules: modules.length,
                completedModules: modules.filter(m => m.progress.percentage === 100).length,
                totalLessons,
                completedLessons,
                overallProgress: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
            });
        } catch (error) {
            console.error('Error getting modules:', error);
            res.status(500).json({ error: 'Failed to get modules' });
        }
    },

    // GET /api/theory/modules/:slug - Get specific module with lessons
    getModule: (req, res) => {
        try {
            const { slug } = req.params;
            const username = req.user?.username;
            const module = enhancedModules[slug];

            if (!module) {
                return res.status(404).json({ error: 'Module not found' });
            }

            const userProgress = username ? loadUserProgress(username) : {};
            const progress = calculateModuleProgress(module.id, userProgress);

            // Add completion status to each lesson
            const lessonsWithProgress = (module.lessons || []).map(lesson => {
                const lessonKey = `${module.id}-${lesson.slug}`;
                return {
                    ...lesson,
                    completed: userProgress[lessonKey]?.completed || false,
                    completedAt: userProgress[lessonKey]?.completed_at || null
                };
            });

            res.json({
                ...module,
                lessons: lessonsWithProgress,
                progress
            });
        } catch (error) {
            console.error('Error getting module:', error);
            res.status(500).json({ error: 'Failed to get module' });
        }
    },

    // GET /api/theory/lessons/:slug - Get lesson content
    getLesson: (req, res) => {
        try {
            const { slug } = req.params;
            const content = lessonContent[slug];

            if (!content) {
                return res.status(404).json({ error: 'Lesson content not found' });
            }

            res.json(content);
        } catch (error) {
            console.error('Error getting lesson:', error);
            res.status(500).json({ error: 'Failed to get lesson' });
        }
    },

    // POST /api/theory/lessons/:moduleId/:lessonSlug/complete - Mark lesson as completed
    completeLesson: (req, res) => {
        try {
            const { moduleId, lessonSlug } = req.params;
            const username = req.user?.username;

            if (!username) {
                return res.status(401).json({ error: 'Authentication required' });
            }

            const module = enhancedModules[moduleId];
            if (!module) {
                return res.status(404).json({ error: 'Module not found' });
            }

            const lesson = (module.lessons || []).find(l => l.slug === lessonSlug);
            if (!lesson) {
                return res.status(404).json({ error: 'Lesson not found' });
            }

            // Load and update user progress
            const userProgress = loadUserProgress(username);
            const lessonKey = `${moduleId}-${lessonSlug}`;
            
            userProgress[lessonKey] = {
                completed: true,
                completed_at: new Date().toISOString()
            };

            // Save progress
            if (saveUserProgress(username, userProgress)) {
                const moduleProgress = calculateModuleProgress(moduleId, userProgress);
                res.json({
                    success: true,
                    lessonKey,
                    moduleProgress
                });
            } else {
                res.status(500).json({ error: 'Failed to save progress' });
            }
        } catch (error) {
            console.error('Error completing lesson:', error);
            res.status(500).json({ error: 'Failed to complete lesson' });
        }
    },

    // GET /api/theory/overview - Get learning overview/stats
    getOverview: (req, res) => {
        try {
            const username = req.user?.username;
            const userProgress = username ? loadUserProgress(username) : {};

            let totalLessons = 0;
            let completedLessons = 0;
            let completedModules = 0;

            const moduleStats = Object.values(enhancedModules).map(module => {
                const progress = calculateModuleProgress(module.id, userProgress);
                totalLessons += progress.total;
                completedLessons += progress.completed;
                
                if (progress.percentage === 100) {
                    completedModules++;
                }

                return {
                    id: module.id,
                    title: module.title,
                    category: module.category,
                    difficulty: module.difficulty,
                    icon: module.icon,
                    progress
                };
            });

            res.json({
                totalModules: Object.keys(enhancedModules).length,
                completedModules,
                totalLessons,
                completedLessons,
                overallProgress: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
                moduleStats
            });
        } catch (error) {
            console.error('Error getting overview:', error);
            res.status(500).json({ error: 'Failed to get overview' });
        }
    }
};

module.exports = theoryRoutes;