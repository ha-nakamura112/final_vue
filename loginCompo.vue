<template>
  <div>
    <input type="text" v-model="uname" placeholder="Write your email">
    <input type="text" v-model="pass" placeholder="Write your password">
    <button @click="login">Log In</button>
  </div>
</template>

<script>
//import json
export default {
  name: 'loginPage',
  data(){
    return {
      uname:'',
      pass:'',
      jsonData: //importjson
    }
  },
  methods: {
    login(){
      if(jsonData.uname == uname && jsonData.pass == pass){
        //sessionStorage.getItem('user', uname or id)
        //update user info with data or some
        //go to main page
      }else{
        alert('Username or Password is wrong')
      }
    },
    logout(){
      //sessionStorage.clear()
      //go to login Page
    }
  },
}
</script>

<style>

</style>
