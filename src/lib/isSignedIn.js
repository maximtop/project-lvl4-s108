export default async (ctx, next) => {
  if (ctx.session.userId) {
  // if (ctx.session.userId || !ctx.session.userId) {
  //   ctx.session.userId = '1';
    await next();
  } else {
    ctx.flash.set('Sign in first');
    ctx.redirect('/');
  }
};
