const User = require('../model/userModel');
const Session = require('../model/sessionModel');

User.hasMany(Session, { foreignKey: 'userId' });
Session.belongsTo(User, {constraints: true, onDelete: 'CASCADE', onUpdate: 'CASCADE', foreignKey: 'userId' });