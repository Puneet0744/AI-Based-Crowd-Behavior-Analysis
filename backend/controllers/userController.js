const { db } = require('../config/firebase');

exports.getTourists = async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: 'Database not initialized' });

    const snapshot = await db.collection('users').get();
    
    const tourists = [];
    snapshot.forEach(doc => {
      tourists.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return res.status(200).json(tourists);
  } catch (error) {
    console.error('Error fetching tourists:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
