const { db } = require('../config/firebase');

exports.getDashboardStats = async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: 'Database not initialized' });

    const incidentsSnapshot = await db.collection('incidents').get();
    let activeIncidents = 0;
    let resolvedIncidents = 0;

    incidentsSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.status === 'ACTIVE') {
        activeIncidents++;
      } else if (data.status === 'RESOLVED') {
        resolvedIncidents++;
      }
    });

    const usersSnapshot = await db.collection('users').get();
    const totalUsers = usersSnapshot.size;

    return res.status(200).json({
      activeIncidents,
      totalUsers,
      resolvedIncidents
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
