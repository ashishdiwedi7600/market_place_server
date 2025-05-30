const extractEmail = (text) =>
    text.match(/[\w.-]+@[\w.-]+\.\w+/)?.[0] || null;

const extractPhone = (text) =>
    text.match(/(\+\d{1,3}[\s-])?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}/)?.[0] || null;

const extractSkills = (text) => {
    const skillsList = [
        'JavaScript', 'Node.js', 'React', 'Angular', 'MongoDB', 'Express',
        'HTML', 'CSS', 'Python', 'Java',  'TypeScript', 'SQL', 'Git', 'Docker','AWS','Redux'
    ];

    return skillsList.filter(skill =>
        new RegExp(`\\b${skill}\\b`, 'i').test(text)
    );
};

const extractSections = (text) => {
    const sections = {};

    const patterns = {
        education: /(education|academic|qualifications)[\s\S]*?(?=\n[A-Z][^\n]*)/i,
        experience: /(experience|employment|work history)[\s\S]*?(?=\n[A-Z][^\n]*)/i,
        projects: /(projects|portfolio)[\s\S]*?(?=\n[A-Z][^\n]*)/i
    };

    for (const key in patterns) {
        const match = text.match(patterns[key]);
        if (match) sections[key] = match[0].trim();
    }

    return sections;
};
const generateRandomToken = () =>
    Math.random().toString(36).substring(2) + Date.now().toString(36);

module.exports = { extractEmail, extractPhone, extractSections, extractSkills,generateRandomToken }