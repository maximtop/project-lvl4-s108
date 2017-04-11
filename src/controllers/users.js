import buildFormObj from '../lib/formObjectBuilder';
import isSignedIn from '../lib/isSignedIn';

export default (router, { User, Task }) => {
  router
    .use('/users', isSignedIn)
    .get('users', '/users', async (ctx) => {
      const users = await User.findAll();
      ctx.render('users', { users });
    })
    .get('newUser', '/users/new', (ctx) => {
      const user = User.build();
      ctx.render('users/new', { f: buildFormObj(user) });
    })
    .post('users', '/users', async (ctx) => {
      const form = ctx.request.body.form;
      const user = User.build(form);
      try {
        await user.save();
        ctx.flash.set('User has been created');
        ctx.redirect(router.url('root'));
      } catch (e) {
        ctx.render('users/new', { f: buildFormObj(user, e) });
      }
    })
    .get('user', '/users/:id', async (ctx) => {
      try {
        const user = await User.findById(ctx.params.id, { include: [{ model: Task, as: 'Assignee' }] });
        ctx.render('users/profile', { user });
      } catch (e) {
        console.log(e);
      }
    })
    .get('userEdit', '/users/:id/edit', async (ctx) => {
      const id = ctx.params.id;
      const user = await User.findById(id);
      ctx.render('users/edit', { f: buildFormObj(user) });
    })
    .patch('userUpdate', '/users/:id', async (ctx) => {
      const id = ctx.params.id;
      const form = ctx.request.body.form;
      const user = await User.findById(id);
      try {
        await user.update({
          email: form.email,
          firstName: form.firstName,
          lastName: form.lastName,
        }, {
          where: {
            id,
          },
        });
        ctx.flash.set('User info was updated');
        ctx.redirect(router.url('users'));
      } catch (e) {
        ctx.render('users/edit', { f: buildFormObj(user, e) });
      }
    });
};
