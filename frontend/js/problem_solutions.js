// Problem solutions for validation
const problemSolutions = {
    'two-sum': {
        keywords: ['target', 'map', 'Map', 'dict', 'HashMap', 'return'],
        expectedOutput: ['[0,1]', '[1,2]', 'indices'],
        antiPatterns: ['// Your code here', 'pass', 'TODO']
    },
    'valid-parentheses': {
        keywords: ['stack', 'Stack', 'return', 'push', 'pop'],
        expectedOutput: ['true', 'false', 'valid'],
        antiPatterns: ['// Your code here', 'pass', 'TODO']
    },
    'reverse-linked-list': {
        keywords: ['ListNode', 'next', 'prev', 'return'],
        expectedOutput: ['reversed', 'head'],
        antiPatterns: ['// Your code here', 'pass', 'TODO']
    },
    'binary-search': {
        keywords: ['left', 'right', 'mid', 'return', 'while'],
        expectedOutput: ['index', 'found', '-1'],
        antiPatterns: ['// Your code here', 'pass', 'TODO']
    },
    'climbing-stairs': {
        keywords: ['return', 'dp', 'fibonacci', 'prev', 'curr'],
        expectedOutput: ['ways', 'steps'],
        antiPatterns: ['// Your code here', 'pass', 'TODO']
    }
};

// Make it available globally
if (typeof window !== 'undefined') {
    window.problemSolutions = problemSolutions;
}

// For Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = problemSolutions;
}