import _ from 'lodash';

export default (object, error = { errors: [] }) => {
  // console.log('test', _.groupBy(error.errors, 'path'));
  return {
    name: 'form',
    object,
    errors: _.groupBy(error.errors, 'path'),
  };
};
