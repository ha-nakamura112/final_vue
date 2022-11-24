<template>
  <div >
    <!-- recommand products for this user -->
    <div class="section">
      <h3>Recommand Products</h3>
      <div class="cBox">
        <div>
          <input type="radio" class="radio" name = "rate" @change="chgHeigh" value = "female"> Female
        </div>
        <div>
          <input type="radio" class="radio" name = "rate" @change="chgHeigh" value = "male"> male
        </div>
        <div>
          <input type="radio" class="radio" name = "rate" @change="chgHeigh" value = "young"> under 40
        </div>
        <div>
          <input type="radio" class="radio" name = "rate" @change="chgHeigh" value = "old"> older than 40
        </div>
      </div>
      <div class="prods">
        <div class="prod" v-for="(prod, idx) in heighlight" :key="idx">
        <h2>{{prod.name}}</h2>
        <h1>{{prod.ocuntry}}</h1>
        <img :src="prod.image_path_0" alt="img">
        <h1>{{prod.price}}</h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import JsonService from '../../services/JsonService';
// npm install vue-star-rating@next
import StarRating from "vue-star-rating";
import { Swiper, SwiperSlide } from "swiper/vue";

export default {
  name: "ProfileHeighlightPage",
  props:['loggedUser'],
  components:{
    StarRating,
    Swiper,
    SwiperSlide,
  },
  data(){
    return {
      products:'',
      purchased:[],
      userinfo: '',
      heighlight:new Map(),
      users:[],
      flag:false,
      maleProds : [],
      femaleProds : [],
      oldProds : [],
      youngProds : [],
      val:'',
      male:[],
    }
  },
  methods:{
    setUserinfo(){
      if(!sessionStorage.getItem('user')){
        this.userinfo = '';
      }else{
        this.userinfo = JSON.parse(sessionStorage.getItem('user'));
      }
    },
    loadProducts(){
      JsonService.getJson('data/json/productJson.json')
      .then((res)=>{
          this.products = res.data;
      })
      .catch((e)=>console.log(e));
    },
    loadpurchased(){
      JsonService.getJson('data/json/purchacedJson.json')
      .then((res)=>{
          this.purchased = res.data;
      })
      .catch((e)=>console.log(e));
    },
    loadUsers(){
      JsonService.getJson('data/json/userJson.json')
      .then((res)=>{
          this.users = res.data;
      })
      .catch((e)=>console.log(e));
    },
    makeHighlight(){
      let femalegenders = new Map();
      let malegenders = new Map();
      let youngs = new Map();
      let olders = new Map();
      this.users.forEach(function(user){
        if(user.gender == 'Female'){
          femalegenders.set(user.id,user)
        }else if(user.gender == 'Male'){
          malegenders.set(user.id,user)
        }
        if(user.age > 18 && user.age < 40){
          youngs.set(user.id, user)
        }else if(user.age >= 40){
          olders.set(user.id,user);
        }
      })

      let maleProd = new Map();
      let femaleProd = new Map();
      this.purchased.forEach(function(prod){
        if(femalegenders.has(prod.user_id)){
          if(femaleProd.has(prod.product_id)){
            femaleProd.get(prod.product_id).amount += 1;
          }else{
            let obj = {id:prod.id,pId:prod.product_id,uid:prod.user_id,amount:1}
            femaleProd.set(prod.product_id,obj);
          }
        }else if(malegenders.has(prod.user_id)){
          if(maleProd.has(prod.product_id)){
            maleProd.get(prod.product_id).amount += 1;
          }else{
            let obj = {id:prod.id,pId:prod.product_id,uid:prod.user_id,amount:1}
            maleProd.set(prod.product_id,obj);
          }
        }
      })
      let youngProd = new Map();
      let oldProd = new Map();
      this.purchased.forEach(function(prod){
        if(youngs.has(prod.user_id)){
          if(youngProd.has(prod.product_id)){
            youngProd.get(prod.product_id).amount += 1;
          }else{
            let obj = {id:prod.id,pId:prod.product_id,uid:prod.user_id,amount:1};
            youngProd.set(prod.product_id,obj);
          }
        }else if(olders.has(prod.user_id)){
          if(oldProd.has(prod.product_id)){
            oldProd.get(prod.product_id).amount += 1;
          }else{
            let obj = {id:prod.id,pId:prod.product_id,uid:prod.user_id,amount:1}
            oldProd.set(prod.product_id,obj);
          }
        }
      })
      this.chg(maleProd,this.maleProds)
      this.chg(femaleProd,this.femaleProds)
      this.chg(oldProd,this.oldProds)
      this.chg(youngProd,this.youngProds)

      console.log(this.maleProds)
      // console.log(this.femaleProds)
      // console.log(this.oldProds)
      // console.log(this.youngProds)
      this.sortHeighlight(this.maleProds,this.male)
      console.log(this.maleProds)


    },
    setHighlight(){
      if(sessionStorage.getItem('user')){
        if(this.userinfo.gender == 'Female'){
          this.heighlight = this.femaleProds;
        }else{
          this.heighlight = this.maleProds;
        }
      }
    },
    sortHeighlight(array,newArray){
          for(let i = 0; i < array.length; i++){
            for(let k = i+1; k < array.length ; k++){
              console.log(array[i])
              // console.log(array[k].rates)
              if(array[i].rates < array[k].rates){
                newArray.push(array[i]);
              }
            }
          }
    },
    chg(prodlist,array){
      let prods = this.products;
      prodlist.forEach(function(male){
        prods.forEach(function(prod){
          if(male.pId == prod.id){
            prod.rates = male.amount;
            array.push(prod);
          }
        })
      })
      return array;
    },
    chgHeigh(){
      this.val = document.querySelector('input[name="rate"]:checked').value;
        switch(this.val){
          case 'male':
          this.heighlight = this.maleProds;
          break;

          case 'female':
            this.heighlight = this.femaleProds;
            break;
          
          case 'old' : 
          this.heighlight = this.oldProds;
          break;

          case 'young' :
            this.heighlight = this.youngProds;
            break;
        }
    }
  },
  mounted(){
    this.loadProducts();
    this.loadpurchased();
    this.loadUsers();
    this.setUserinfo();
  },
  watch:{
    users:function(){
      this.makeHighlight();
      this.flag = !this.flag;
    },
    flag:function(){
      this.setHighlight();
    },
    val: function(){
      this.chgHeigh();
    }
  }
  

};
</script>

<style scoped>
.section{
  display: flex;
  flex-direction: column;
  row-gap: 3vh;
  border: .5px solid lightgray;
}

h3 {
  padding: 1.5% 3%;
}
.cBox {
  width: 60%;
  display: flex;
  column-gap: 3vh;
  align-items:center;
  justify-content: flex-start;
  padding-left: 4vh;
  font-size: 20px;
}

.cBox input{
  border-radius: .2m;
  box-shadow: inset 0px 0px 0px 2px #f7f2f2;
}

/* .cBox input::before{
    transform: rotateZ(180deg);
    background: #FF4040;
} */

/* .prods{
  display: flex;
  overflow: hidden;

}
.prod{
  display: flex;
  flex-direction: column;
} */

.slideImg{
    width: 10%;
  }
  .swiper{
    overflow: hidden;
  }
  .swiper-slide{
    display: flex;
    justify-content: center;
    align-content: center;
  }

  .prods{
  display: flex;
  padding: 1% 3%;
  column-gap: 3vh;
}
.prod{
  border: 1px solid whitesmoke;
  padding: 3%;
  width: fit-content;
  height: 65vh;
  display: flex;
  flex-direction: column;
  row-gap: 1vh;
}


</style>
