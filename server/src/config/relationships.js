const User = require('../model/userModel');
const Session = require('../model/sessionModel');
const Income = require('../model/incomeModel');

User.hasMany(Session, { foreignKey: 'userId' });
Session.belongsTo(User, {constraints: true, onDelete: 'CASCADE', onUpdate: 'CASCADE', foreignKey: 'userId' });

User.hasMany(Income, { foreignKey: 'userId' });
Income.belongsTo(User, {constraints: true, onDelete: 'CASCADE', onUpdate: 'CASCADE', foreignKey: 'userId' });
