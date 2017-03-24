import Sequelize from 'sequelize';

export default connect => connect.define('TaskStatus', {
  name: {
    type: Sequelize.STRING,
    unique: true,
    validate: {
      notEmpty: {
        args: true,
        msg: 'Value must not be empty',
      },
    },
  },
}, {
  freezeTableName: true,
});
