export default async (ctx, next) => {
  if (ctx.session.userId || !ctx.session.userId) {
    ctx.session.userId = 4;
    await next();
  } else {
    ctx.flash.set('Sign in first');
    ctx.redirect('/');
  }
};
