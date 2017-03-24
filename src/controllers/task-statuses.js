import buildFormObj from '../lib/formObjectBuilder';

export default (router, { TaskStatus }) => {
  router
    .get('taskStatuses', '/task-statuses', async (ctx) => {
      const taskStatuses = await TaskStatus.findAll();
      ctx.render('task-statuses', { taskStatuses });
    })
    .get('newTaskStatus', '/task-statuses/new', (ctx) => {
      const task = TaskStatus.build();
      ctx.render('task-statuses/new', { f: buildFormObj(task) });
    })
    .post('taskStatuses', '/task-statuses', async (ctx) => {
      const form = ctx.request.body.form;
      const taskStatus = TaskStatus.build(form);
      try {
        await taskStatus.save();
        ctx.flash.set('Task status have been created');
        ctx.redirect(router.url('taskStatuses'));
      } catch (e) {
        ctx.render('task-statuses/new', { f: buildFormObj(form, e) });
      }
    });
};