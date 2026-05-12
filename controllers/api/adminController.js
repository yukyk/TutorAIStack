const counters = {
  pageVisits: 0,
  aiRequests: 0,
  codeExecutions: 0,
  modeCounts: { hint: 0, logic: 0, humanize: 0, debug: 0, optimize: 0 },
};

const incrementPageVisit = () => { counters.pageVisits++; };

const incrementAI = (mode) => {
  counters.aiRequests++;
  if (mode && Object.prototype.hasOwnProperty.call(counters.modeCounts, mode)) {
    counters.modeCounts[mode]++;
  }
};

const incrementExecute = () => { counters.codeExecutions++; };

const getStats = (req, res) => {
  const auth = req.headers['authorization'];
  if (!auth || auth !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const modeEntries = Object.entries(counters.modeCounts);
  const mostUsedMode = modeEntries.reduce((a, b) => (b[1] > a[1] ? b : a), modeEntries[0])[0];

  res.json({
    pageVisits: counters.pageVisits,
    aiRequests: counters.aiRequests,
    codeExecutions: counters.codeExecutions,
    modeCounts: counters.modeCounts,
    mostUsedMode,
    uptime: Math.floor(process.uptime()),
    nodeVersion: process.version,
    env: process.env.NODE_ENV || 'development',
  });
};

module.exports = { incrementPageVisit, incrementAI, incrementExecute, getStats };
