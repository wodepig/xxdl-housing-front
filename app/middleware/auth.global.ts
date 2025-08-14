export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/login') {
    // 把登陆/注册页面排除掉
    return
  }

  const { loggedIn } = useUserSession();
  // if (!loggedIn.value) {
  //   return navigateTo("/login");
  // }
});