import buildFormObj from '../lib/formObjectBuilder';
import isSignedIn from '../lib/isSignedIn';

export default (router, { Task, User, TaskStatus }) => {
  router
    .use('/tasks', isSignedIn)
    .get('tasks', '/tasks', async (ctx) => {
      try {
        const tasks = await Task.findAll({ include: [{ model: User, as: 'Assignee' }, TaskStatus] });
        ctx.render('tasks', { tasks });
      } catch (e) {
        console.log(e);
      }
    })
    .get('newTask', '/tasks/new', async (ctx) => {
      try {
        const task = Task.build();
        const users = await User.findAll();
        const taskStatuses = await TaskStatus.findAll();
        console.log(ctx.session);
        ctx.render('tasks/new', { f: buildFormObj(task), users, taskStatuses });
      } catch (e) {
        console.log(e);
      }
    })
    .post('tasks', '/tasks', async (ctx) => {
      const form = ctx.request.body.form;
      // form.creatorId = ctx.session.userId;
      console.log(form);
      const task = Task.build(form);
      try {
        await task.save();
        ctx.flash.set('task has been created');
        ctx.redirect(router.url('root'));
      } catch (e) {
        console.log(e);
        ctx.render('tasks/new', { f: buildFormObj(task, e) });
      }
    })
    .get('task', '/tasks/:id', async (ctx) => {
      try {
        const task = await Task.findById(ctx.params.id,
          { include: [TaskStatus,
          { model: User, as: 'Creator' },
          { model: User, as: 'Assignee' }] });
        console.log(task);
        ctx.render('tasks/task', { task });
      } catch (e) {
        console.log(e);
      }
    });
    // .get('taskEdit', '/tasks/:id/edit', async (ctx) => {
    //   const id = ctx.params.id;
    //   const task = await Task.findById(id);
    //   ctx.render('tasks/edit', { f: buildFormObj(task) });
    // })
    // .patch('taskUpdate', '/tasks/:id', async (ctx) => {
    //   const id = ctx.params.id;
    //   const form = ctx.request.body.form;
    //   const task = await Task.findById(id);
    //   try {
    //     await task.update({
    //       email: form.email,
    //       firstName: form.firstName,
    //       lastName: form.lastName,
    //     }, {
    //       where: {
    //         id,
    //       },
    //     });
    //     ctx.flash.set('task info was updated');
    //     ctx.redirect(router.url('tasks'));
    //   } catch (e) {
    //     ctx.render('tasks/edit', { f: buildFormObj(task, e) });
    //   }
    // })
    // .delete('taskDelete', '/tasks/:id', async (ctx) => {
    //   const id = ctx.params.id;
    //   await Task.destroy({
    //     where: {
    //       id,
    //     },
    //   });
    //   ctx.redirect(router.url('tasks'));
    // });
};
