import welcome from './welcome';
import users from './users';
import sessions from './sessions';
import taskStatuses from './task-statuses';

const controllers = [welcome, users, sessions, taskStatuses];

export default (router, container) => controllers.forEach(f => f(router, container));
