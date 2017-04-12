import _ from 'lodash';

export default (object, error = { errors: [] }) =>
  // console.log('test', _.groupBy(error.errors, 'path'));
   ({
     name: 'form',
     object,
     errors: _.groupBy(error.errors, 'path'),
   });
