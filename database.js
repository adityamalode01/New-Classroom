// ================= SMART CLASSROOM DATABASE SYSTEM =================
// This file contains all database operations for the platform
// Uses localStorage as the primary database

const Database = {
    // ================= INITIALIZATION =================
    init: function() {
        console.log('Initializing Smart Classroom Database...');
        
        // Initialize all storage with default data if empty
        this.initUsers();
        this.initCourses();
        this.initMaterials();
        this.initDownloads();
        this.initProgress();
        this.initSettings();
        
        console.log('Database initialized successfully!');
    },

    // ================= USER MANAGEMENT =================
    initUsers: function() {
        if (!localStorage.getItem('users')) {
            const defaultUsers = [
                {
                    id: 'user_001',
                    username: 'RameshPrasad',
                    email: 'rameshprasadrp123@gmail.com',
                    password: 'hashed_password_123', // In production, use proper hashing
                    name: 'Ramesh Prasad',
                    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ramesh',
                    phone: '+917498147593',
                    education: 'B.Tech Computer Science',
                    university: 'Anna University',
                    location: 'Chennai, India',
                    bio: 'Passionate Computer Science student focused on mastering full-stack development.',
                    joined: '2023-01-15',
                    role: 'student',
                    status: 'active',
                    skills: ['C Programming', 'C++', 'DBMS', 'OS', 'Web Development'],
                    coursesEnrolled: ['course_001', 'course_002', 'course_003'],
                    achievements: ['cert_001', 'cert_002']
                }
            ];
            localStorage.setItem('users', JSON.stringify(defaultUsers));
        }
    },

    // User CRUD Operations
    getUsers: function() {
        return JSON.parse(localStorage.getItem('users')) || [];
    },

    getUserById: function(id) {
        const users = this.getUsers();
        return users.find(user => user.id === id);
    },

    getUserByEmail: function(email) {
        const users = this.getUsers();
        return users.find(user => user.email === email);
    },

    addUser: function(userData) {
        const users = this.getUsers();
        const newUser = {
            id: 'user_' + Date.now(),
            ...userData,
            joined: new Date().toISOString().split('T')[0],
            role: 'student',
            status: 'active',
            coursesEnrolled: [],
            achievements: []
        };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        return newUser;
    },

    updateUser: function(id, updates) {
        const users = this.getUsers();
        const index = users.findIndex(user => user.id === id);
        if (index !== -1) {
            users[index] = { ...users[index], ...updates };
            localStorage.setItem('users', JSON.stringify(users));
            return users[index];
        }
        return null;
    },

    deleteUser: function(id) {
        const users = this.getUsers();
        const filteredUsers = users.filter(user => user.id !== id);
        localStorage.setItem('users', JSON.stringify(filteredUsers));
        return true;
    },

    // ================= COURSE MANAGEMENT =================
    initCourses: function() {
        if (!localStorage.getItem('courses')) {
            const defaultCourses = [
                {
                    id: 'course_001',
                    code: 'CS101',
                    name: 'C Programming',
                    description: 'Master the fundamentals of C programming including data types, control structures, functions, and pointers.',
                    instructor: 'Dr. S. Kumar',
                    semester: 1,
                    units: 4,
                    duration: '45 hours',
                    category: 'Programming',
                    level: 'Beginner',
                    tags: ['programming', 'c', 'basics'],
                    materials: ['mat_001', 'mat_002', 'mat_003'],
                    videos: ['vid_001', 'vid_002', 'vid_003'],
                    enrolledStudents: ['user_001'],
                    rating: 4.8,
                    reviews: 125
                },
                {
                    id: 'course_002',
                    code: 'CS102',
                    name: 'C++ Programming',
                    description: 'Learn Object-Oriented Programming concepts, classes, inheritance, polymorphism, and templates.',
                    instructor: 'Prof. A. Sharma',
                    semester: 2,
                    units: 4,
                    duration: '50 hours',
                    category: 'Programming',
                    level: 'Intermediate',
                    tags: ['programming', 'c++', 'oop'],
                    materials: ['mat_004', 'mat_005', 'mat_006'],
                    videos: ['vid_004', 'vid_005', 'vid_006'],
                    enrolledStudents: ['user_001'],
                    rating: 4.6,
                    reviews: 98
                },
                {
                    id: 'course_003',
                    code: 'CS301',
                    name: 'Operating Systems',
                    description: 'Explore processes, memory management, CPU scheduling algorithms, and file systems.',
                    instructor: 'Dr. R. Patel',
                    semester: 3,
                    units: 6,
                    duration: '60 hours',
                    category: 'Systems',
                    level: 'Intermediate',
                    tags: ['os', 'systems', 'memory'],
                    materials: ['mat_007', 'mat_008', 'mat_009'],
                    videos: ['vid_007', 'vid_008', 'vid_009'],
                    enrolledStudents: ['user_001'],
                    rating: 4.7,
                    reviews: 156
                },
                {
                    id: 'course_004',
                    code: 'CS302',
                    name: 'Database Management',
                    description: 'Master database design, ER modeling, normalization, SQL queries, and transactions.',
                    instructor: 'Prof. M. Singh',
                    semester: 4,
                    units: 5,
                    duration: '55 hours',
                    category: 'Database',
                    level: 'Intermediate',
                    tags: ['database', 'sql', 'dbms'],
                    materials: ['mat_010', 'mat_011', 'mat_012'],
                    videos: ['vid_010', 'vid_011', 'vid_012'],
                    enrolledStudents: [],
                    rating: 4.5,
                    reviews: 87
                }
            ];
            localStorage.setItem('courses', JSON.stringify(defaultCourses));
        }
    },

    getCourses: function() {
        return JSON.parse(localStorage.getItem('courses')) || [];
    },

    getCourseById: function(id) {
        const courses = this.getCourses();
        return courses.find(course => course.id === id);
    },

    getCoursesByCategory: function(category) {
        const courses = this.getCourses();
        return courses.filter(course => course.category === category);
    },

    // ================= STUDY MATERIALS =================
    initMaterials: function() {
        if (!localStorage.getItem('materials')) {
            const defaultMaterials = [
                // C Programming Materials
                {
                    id: 'mat_001',
                    courseId: 'course_001',
                    name: 'Unit 1 - Introduction to C',
                    type: 'pdf',
                    size: '2.4 MB',
                    pages: 45,
                    url: 'materials/c-programming/unit1.pdf',
                    uploaded: '2024-01-10',
                    downloads: 245
                },
                {
                    id: 'mat_002',
                    courseId: 'course_001',
                    name: 'Unit 2 - Control Structures',
                    type: 'pdf',
                    size: '3.1 MB',
                    pages: 52,
                    url: 'materials/c-programming/unit2.pdf',
                    uploaded: '2024-01-15',
                    downloads: 198
                },
                {
                    id: 'mat_003',
                    courseId: 'course_001',
                    name: 'Unit 3 - Functions and Arrays',
                    type: 'pdf',
                    size: '4.2 MB',
                    pages: 68,
                    url: 'materials/c-programming/unit3.pdf',
                    uploaded: '2024-01-20',
                    downloads: 176
                },
                // C++ Programming Materials
                {
                    id: 'mat_004',
                    courseId: 'course_002',
                    name: 'Unit 1 - OOP Concepts',
                    type: 'pdf',
                    size: '2.8 MB',
                    pages: 48,
                    url: 'materials/cpp-programming/unit1.pdf',
                    uploaded: '2024-02-01',
                    downloads: 189
                },
                {
                    id: 'mat_005',
                    courseId: 'course_002',
                    name: 'Unit 2 - Classes and Objects',
                    type: 'pdf',
                    size: '3.5 MB',
                    pages: 55,
                    url: 'materials/cpp-programming/unit2.pdf',
                    uploaded: '2024-02-05',
                    downloads: 165
                },
                // Operating Systems Materials
                {
                    id: 'mat_007',
                    courseId: 'course_003',
                    name: 'Unit 1 - Introduction to OS',
                    type: 'pdf',
                    size: '2.6 MB',
                    pages: 42,
                    url: 'materials/os/unit1.pdf',
                    uploaded: '2024-02-10',
                    downloads: 156
                },
                {
                    id: 'mat_008',
                    courseId: 'course_003',
                    name: 'Unit 2 - Process Management',
                    type: 'pdf',
                    size: '3.9 MB',
                    pages: 65,
                    url: 'materials/os/unit2.pdf',
                    uploaded: '2024-02-15',
                    downloads: 143
                }
            ];
            localStorage.setItem('materials', JSON.stringify(defaultMaterials));
        }
    },

    getMaterials: function() {
        return JSON.parse(localStorage.getItem('materials')) || [];
    },

    getMaterialsByCourse: function(courseId) {
        const materials = this.getMaterials();
        return materials.filter(mat => mat.courseId === courseId);
    },

    getMaterialById: function(id) {
        const materials = this.getMaterials();
        return materials.find(mat => mat.id === id);
    },

    // ================= VIDEO LECTURES =================
    getVideos: function() {
        if (!localStorage.getItem('videos')) {
            const defaultVideos = [
                // C Programming Videos
                {
                    id: 'vid_001',
                    courseId: 'course_001',
                    title: 'Introduction to C Programming',
                    duration: '45:20',
                    instructor: 'Dr. S. Kumar',
                    url: 'videos/c-programming/intro.mp4',
                    thumbnail: 'thumbnails/c-intro.jpg',
                    uploaded: '2024-01-05',
                    views: 1245
                },
                {
                    id: 'vid_002',
                    courseId: 'course_001',
                    title: 'Variables and Data Types',
                    duration: '38:15',
                    instructor: 'Dr. S. Kumar',
                    url: 'videos/c-programming/variables.mp4',
                    thumbnail: 'thumbnails/c-variables.jpg',
                    uploaded: '2024-01-12',
                    views: 987
                },
                // C++ Programming Videos
                {
                    id: 'vid_004',
                    courseId: 'course_002',
                    title: 'Introduction to OOP',
                    duration: '42:30',
                    instructor: 'Prof. A. Sharma',
                    url: 'videos/cpp-programming/oop-intro.mp4',
                    thumbnail: 'thumbnails/cpp-oop.jpg',
                    uploaded: '2024-02-03',
                    views: 876
                },
                // Operating Systems Videos
                {
                    id: 'vid_007',
                    courseId: 'course_003',
                    title: 'OS Introduction and Types',
                    duration: '48:30',
                    instructor: 'Dr. R. Patel',
                    url: 'videos/os/intro.mp4',
                    thumbnail: 'thumbnails/os-intro.jpg',
                    uploaded: '2024-02-12',
                    views: 765
                }
            ];
            localStorage.setItem('videos', JSON.stringify(defaultVideos));
        }
        return JSON.parse(localStorage.getItem('videos')) || [];
    },

    getVideosByCourse: function(courseId) {
        const videos = this.getVideos();
        return videos.filter(vid => vid.courseId === courseId);
    },

    // ================= DOWNLOADS MANAGEMENT =================
    initDownloads: function() {
        if (!localStorage.getItem('downloads')) {
            const defaultDownloads = [
                {
                    id: 'dl_001',
                    userId: 'user_001',
                    itemId: 'mat_001',
                    itemType: 'material',
                    itemName: 'Unit 1 - Introduction to C',
                    downloadedAt: '2024-03-15T10:30:00Z',
                    fileSize: '2.4 MB',
                    status: 'completed'
                },
                {
                    id: 'dl_002',
                    userId: 'user_001',
                    itemId: 'mat_002',
                    itemType: 'material',
                    itemName: 'Unit 2 - Control Structures',
                    downloadedAt: '2024-03-14T14:45:00Z',
                    fileSize: '3.1 MB',
                    status: 'completed'
                },
                {
                    id: 'dl_003',
                    userId: 'user_001',
                    itemId: 'vid_001',
                    itemType: 'video',
                    itemName: 'Introduction to C Programming',
                    downloadedAt: '2024-03-13T16:20:00Z',
                    fileSize: '245 MB',
                    status: 'completed'
                }
            ];
            localStorage.setItem('downloads', JSON.stringify(defaultDownloads));
        }
    },

    getDownloads: function(userId = null) {
        const downloads = JSON.parse(localStorage.getItem('downloads')) || [];
        if (userId) {
            return downloads.filter(dl => dl.userId === userId);
        }
        return downloads;
    },

    addDownload: function(downloadData) {
        const downloads = this.getDownloads();
        const newDownload = {
            id: 'dl_' + Date.now(),
            ...downloadData,
            downloadedAt: new Date().toISOString(),
            status: 'completed'
        };
        downloads.push(newDownload);
        localStorage.setItem('downloads', JSON.stringify(downloads));
        
        // Update download count for the material/video
        this.incrementDownloadCount(downloadData.itemId, downloadData.itemType);
        
        return newDownload;
    },

    incrementDownloadCount: function(itemId, itemType) {
        if (itemType === 'material') {
            const materials = this.getMaterials();
            const materialIndex = materials.findIndex(mat => mat.id === itemId);
            if (materialIndex !== -1) {
                materials[materialIndex].downloads = (materials[materialIndex].downloads || 0) + 1;
                localStorage.setItem('materials', JSON.stringify(materials));
            }
        } else if (itemType === 'video') {
            const videos = this.getVideos();
            const videoIndex = videos.findIndex(vid => vid.id === itemId);
            if (videoIndex !== -1) {
                videos[videoIndex].views = (videos[videoIndex].views || 0) + 1;
                localStorage.setItem('videos', JSON.stringify(videos));
            }
        }
    },

    // ================= PROGRESS TRACKING =================
    initProgress: function() {
        if (!localStorage.getItem('progress')) {
            const defaultProgress = [
                {
                    id: 'prog_001',
                    userId: 'user_001',
                    courseId: 'course_001',
                    materialCompleted: ['mat_001', 'mat_002'],
                    videosWatched: ['vid_001'],
                    quizScores: [
                        { quizId: 'quiz_001', score: 85, date: '2024-03-10' },
                        { quizId: 'quiz_002', score: 92, date: '2024-03-12' }
                    ],
                    overallProgress: 65,
                    lastAccessed: '2024-03-15T09:30:00Z'
                },
                {
                    id: 'prog_002',
                    userId: 'user_001',
                    courseId: 'course_002',
                    materialCompleted: ['mat_004'],
                    videosWatched: ['vid_004'],
                    quizScores: [
                        { quizId: 'quiz_003', score: 78, date: '2024-03-08' }
                    ],
                    overallProgress: 42,
                    lastAccessed: '2024-03-14T11:20:00Z'
                }
            ];
            localStorage.setItem('progress', JSON.stringify(defaultProgress));
        }
    },

    getProgress: function(userId = null, courseId = null) {
        const progress = JSON.parse(localStorage.getItem('progress')) || [];
        let filtered = progress;
        
        if (userId) {
            filtered = filtered.filter(p => p.userId === userId);
        }
        if (courseId) {
            filtered = filtered.filter(p => p.courseId === courseId);
        }
        
        return filtered;
    },

    updateProgress: function(userId, courseId, updates) {
        const progress = this.getProgress();
        const index = progress.findIndex(p => p.userId === userId && p.courseId === courseId);
        
        if (index !== -1) {
            progress[index] = {
                ...progress[index],
                ...updates,
                lastAccessed: new Date().toISOString()
            };
        } else {
            const newProgress = {
                id: 'prog_' + Date.now(),
                userId,
                courseId,
                materialCompleted: [],
                videosWatched: [],
                quizScores: [],
                overallProgress: 0,
                lastAccessed: new Date().toISOString(),
                ...updates
            };
            progress.push(newProgress);
        }
        
        localStorage.setItem('progress', JSON.stringify(progress));
        return progress.find(p => p.userId === userId && p.courseId === courseId);
    },

    // ================= SETTINGS =================
    initSettings: function() {
        if (!localStorage.getItem('settings')) {
            const defaultSettings = {
                theme: 'dark',
                fontSize: 'medium',
                emailNotifications: true,
                pushNotifications: true,
                downloadLocation: 'default',
                downloadQuality: 'medium',
                autoPlayVideos: true,
                showProgress: true
            };
            localStorage.setItem('settings', JSON.stringify(defaultSettings));
        }
    },

    getSettings: function() {
        return JSON.parse(localStorage.getItem('settings')) || {};
    },

    updateSettings: function(newSettings) {
        const currentSettings = this.getSettings();
        const updatedSettings = { ...currentSettings, ...newSettings };
        localStorage.setItem('settings', JSON.stringify(updatedSettings));
        return updatedSettings;
    },

    // ================= SEARCH FUNCTIONALITY =================
    search: function(query, type = 'all') {
        const results = {
            courses: [],
            materials: [],
            videos: []
        };
        
        const searchTerm = query.toLowerCase();
        
        if (type === 'all' || type === 'courses') {
            const courses = this.getCourses();
            results.courses = courses.filter(course =>
                course.name.toLowerCase().includes(searchTerm) ||
                course.description.toLowerCase().includes(searchTerm) ||
                course.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
        }
        
        if (type === 'all' || type === 'materials') {
            const materials = this.getMaterials();
            results.materials = materials.filter(material =>
                material.name.toLowerCase().includes(searchTerm)
            );
        }
        
        if (type === 'all' || type === 'videos') {
            const videos = this.getVideos();
            results.videos = videos.filter(video =>
                video.title.toLowerCase().includes(searchTerm) ||
                video.instructor.toLowerCase().includes(searchTerm)
            );
        }
        
        return results;
    },

    // ================= STATISTICS =================
    getStats: function() {
        const users = this.getUsers();
        const courses = this.getCourses();
        const materials = this.getMaterials();
        const videos = this.getVideos();
        const downloads = this.getDownloads();
        
        return {
            totalUsers: users.length,
            totalCourses: courses.length,
            totalMaterials: materials.length,
            totalVideos: videos.length,
            totalDownloads: downloads.length,
            activeUsers: users.filter(u => u.status === 'active').length,
            popularCourse: courses.reduce((prev, current) =>
                (prev.enrolledStudents?.length || 0) > (current.enrolledStudents?.length || 0) ? prev : current
            ),
            topMaterial: materials.reduce((prev, current) =>
                (prev.downloads || 0) > (current.downloads || 0) ? prev : current
            ),
            topVideo: videos.reduce((prev, current) =>
                (prev.views || 0) > (current.views || 0) ? prev : current
            )
        };
    },

    // ================= BACKUP & RESTORE =================
    backupData: function() {
        const backup = {
            users: this.getUsers(),
            courses: this.getCourses(),
            materials: this.getMaterials(),
            videos: this.getVideos(),
            downloads: this.getDownloads(),
            progress: this.getProgress(),
            settings: this.getSettings(),
            timestamp: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `smart-classroom-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        return backup;
    },

    restoreData: function(backupData) {
        if (!backupData || typeof backupData !== 'object') {
            throw new Error('Invalid backup data');
        }
        
        if (backupData.users) localStorage.setItem('users', JSON.stringify(backupData.users));
        if (backupData.courses) localStorage.setItem('courses', JSON.stringify(backupData.courses));
        if (backupData.materials) localStorage.setItem('materials', JSON.stringify(backupData.materials));
        if (backupData.videos) localStorage.setItem('videos', JSON.stringify(backupData.videos));
        if (backupData.downloads) localStorage.setItem('downloads', JSON.stringify(backupData.downloads));
        if (backupData.progress) localStorage.setItem('progress', JSON.stringify(backupData.progress));
        if (backupData.settings) localStorage.setItem('settings', JSON.stringify(backupData.settings));
        
        return true;
    },

    // ================= EXPORT UTILITIES =================
    exportToCSV: function(dataType) {
        let data, headers, filename;
        
        switch (dataType) {
            case 'users':
                data = this.getUsers();
                headers = ['ID', 'Name', 'Email', 'Role', 'Status', 'Joined'];
                filename = 'users.csv';
                break;
            case 'courses':
                data = this.getCourses();
                headers = ['Code', 'Name', 'Instructor', 'Semester', 'Category', 'Rating'];
                filename = 'courses.csv';
                break;
            case 'downloads':
                data = this.getDownloads();
                headers = ['Item Name', 'Type', 'Downloaded At', 'File Size'];
                filename = 'downloads.csv';
                break;
            default:
                throw new Error('Invalid data type');
        }
        
        const csvContent = [
            headers.join(','),
            ...data.map(item => {
                const row = headers.map(header => {
                    switch (header) {
                        case 'ID': return `"${item.id}"`;
                        case 'Name': return `"${item.name || item.itemName || ''}"`;
                        case 'Email': return `"${item.email || ''}"`;
                        case 'Role': return `"${item.role || ''}"`;
                        case 'Status': return `"${item.status || ''}"`;
                        case 'Joined': return `"${item.joined || ''}"`;
                        case 'Code': return `"${item.code || ''}"`;
                        case 'Instructor': return `"${item.instructor || ''}"`;
                        case 'Semester': return item.semester || '';
                        case 'Category': return `"${item.category || ''}"`;
                        case 'Rating': return item.rating || '';
                        case 'Type': return `"${item.itemType || ''}"`;
                        case 'Downloaded At': return `"${item.downloadedAt || ''}"`;
                        case 'File Size': return `"${item.fileSize || ''}"`;
                        default: return '';
                    }
                });
                return row.join(',');
            })
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    },

    // ================= CACHE MANAGEMENT =================
    clearCache: function() {
        const confirmClear = confirm('Are you sure you want to clear all cached data? This will remove all local data except user accounts.');
        if (!confirmClear) return false;
        
        // Keep users and settings, clear everything else
        const users = this.getUsers();
        const settings = this.getSettings();
        
        localStorage.clear();
        
        // Restore users and settings
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('settings', JSON.stringify(settings));
        
        // Reinitialize default data
        this.init();
        
        return true;
    },

    getStorageInfo: function() {
        let totalSize = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                totalSize += localStorage[key].length * 2; // Each char is 2 bytes in localStorage
            }
        }
        
        return {
            totalItems: Object.keys(localStorage).length,
            totalSize: (totalSize / 1024).toFixed(2) + ' KB',
            items: Object.keys(localStorage).map(key => ({
                key,
                size: (localStorage[key].length * 2 / 1024).toFixed(2) + ' KB'
            }))
        };
    }
};

// Auto-initialize database when this file is loaded
Database.init();

// Export the Database object for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Database;
} else {
    window.Database = Database;
}
