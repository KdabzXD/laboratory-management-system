// controllers/dummyController.js
const logActivity = require('../utils/logger');

// Dummy data store
let dummyData = [
  { id: 1, name: 'Sample Item 1' },
  { id: 2, name: 'Sample Item 2' },
];

exports.getAll = async (req, res) => {
  res.json({ data: dummyData });
};

exports.addItem = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Name is required' });

  const newItem = { id: dummyData.length + 1, name };
  dummyData.push(newItem);

  await logActivity({
    activityType: 'Dummy Add',
    description: `Added dummy item: ${name}`,
    performedBy: req.user?.username || 'system',
  });

  res.status(201).json({ message: 'Item added', item: newItem });
};

exports.updateItem = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const item = dummyData.find(d => d.id === parseInt(id));
  if (!item) return res.status(404).json({ message: 'Item not found' });

  item.name = name || item.name;

  await logActivity({
    activityType: 'Dummy Update',
    description: `Updated dummy item ID ${id} to name: ${item.name}`,
    performedBy: req.user?.username || 'system',
  });

  res.json({ message: 'Item updated', item });
};

exports.deleteItem = async (req, res) => {
  const { id } = req.params;
  const index = dummyData.findIndex(d => d.id === parseInt(id));
  if (index === -1) return res.status(404).json({ message: 'Item not found' });

  const [deletedItem] = dummyData.splice(index, 1);

  await logActivity({
    activityType: 'Dummy Delete',
    description: `Deleted dummy item: ${deletedItem.name}`,
    performedBy: req.user?.username || 'system',
  });

  res.json({ message: 'Item deleted', item: deletedItem });
};