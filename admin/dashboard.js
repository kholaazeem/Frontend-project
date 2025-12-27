import supabase  from "../config.js";

async function checkAdmin(){

          const { data: { user } } = await supabase.auth
   .getUser()
   console.log(user)
   if(!user){
    console.log("User is not logged in:", user);
    window.location.href = "../login.html";
    return
   }

//    fetch db to check if user is admin

 const { data, error } = await supabase
  .from('customers')
  .select('*')
  .eq('uid', user.id)    // check uid from auth with uid in db
  .single()
  console.log(data)
  if(data.role !== 'admin'){
    alert("Access denied ");
    window.location.href = "../signup.html";
    return
  }
}
checkAdmin();


    //  Add product in admin page

let prodName = document.getElementById("prod-name")    
let prodPrice = document.getElementById("prod-price")   
let prodCateg = document.getElementById("prod-categ") 
let prodDesc = document.getElementById("prod-desc")
let prodImg= document.getElementById("prod-img")    
let prodForm= document.getElementById("prod-form") 
let colorName = document.querySelectorAll("input[name = 'colorName[]']")
let colorHex = document.querySelectorAll("input[name = 'colorHex[]']")
