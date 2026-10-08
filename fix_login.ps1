\ = Get-Content 'pages/login.vue' -Raw
\ = \"onMounted(() => {
  if (route.query.success\"
\ = \"onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/')
    return
  }

  if (route.query.success\"
\ = \.Replace(\, \)
Set-Content 'pages/login.vue' -Value \
