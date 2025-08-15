export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/login' || to.path === '/redirect') {

    // 把登陆/注册页面排除掉
    return
  }

  // const { loggedIn } = useUserSession();
  const { loggedIn, user, session, fetch, clear, openInPopup } = useUserSession()
  // console.log("loggedIn.value");
  // console.log(loggedIn.value);
  // console.log(user.value);
  // console.log(session.value);
  
  if (!loggedIn.value) {
    // return navigateTo("/login");
  }
});