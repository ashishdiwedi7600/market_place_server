const { NlpManager } = require('node-nlp');

const manager = new NlpManager({ languages: ['en'], forceNER: true });

(async () => {
  // Named Entities
  manager.addNamedEntityText('jobTitle', 'software engineer', ['en'], ['software engineer', 'developer', 'frontend engineer', 'backend engineer']);
  manager.addNamedEntityText('company', 'google', ['en'], ['Google', 'Microsoft', 'Amazon']);
  manager.addNamedEntityText('skill', 'react', ['en'], ['React', 'Node.js', 'MongoDB', 'JavaScript', 'Python']);
  manager.addNamedEntityText('degree', 'bachelor', ['en'], ['BSc', 'Bachelor of Science', 'BS', 'BE']);
  manager.addNamedEntityText('location', 'new york', ['en'], ['New York', 'San Francisco', 'Seattle', 'NYC']);

  // Intent Examples
  manager.addDocument('en', 'Worked as a software engineer at Google in New York', 'resume.experience');
  manager.addDocument('en', 'Software developer at Amazon, Seattle', 'resume.experience');
  manager.addDocument('en', 'Bachelor of Science in Computer Science from MIT', 'resume.education');
  manager.addDocument('en', 'Skilled in React and MongoDB', 'resume.skills');
  manager.addDocument('en', 'Experience with Python and JavaScript', 'resume.skills');

  await manager.train();
  manager.save('./model.nlp');
})();