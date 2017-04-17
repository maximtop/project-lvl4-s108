import Sequelize from 'sequelize';
import encrypt from '../lib/secure';

export default (connect) => {
  const User = connect.define('User', {
    email: {
      type: Sequelize.STRING,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    passwordDigest: {
      type: Sequelize.STRING,
      validate: {
        notEmpty: true,
      },
    },
    firstName: {
      type: Sequelize.STRING,
      field: 'first_name',
    },
    lastName: {
      type: Sequelize.STRING,
      field: 'last_name',
    },
    password: {
      type: Sequelize.VIRTUAL,
      set: function set(value) {
        this.setDataValue('passwordDigest', encrypt(value));
        this.setDataValue('password', value);
        return value;
      },
      validate: {
        len: [1, +Infinity],
      },
    },
  }, {
    getterMethods: {
      fullName: function fullName() {
        return `${this.firstName} ${this.lastName}`;
      },
    },
    // classMethods: {
    //   associate: (models) => {
    //     User.hasMany(models.Task, { as: 'AssignedTask', foreignKey: 'assignedTo' });
    //   },
    // },
    freezeTableName: true, // Model tableName will be the same as the model name
  });
  return User;
};
