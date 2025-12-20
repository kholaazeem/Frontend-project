import supabase from "./config.js";  


            //  ============================================================Sign Up Functionality===========================================================================

 const signupBtn = document.getElementById("signup-btn");                    
 const signupEmail = document.getElementById("signup-email");
 const signupPass = document.getElementById("signup-pass");
 const firstName = document.getElementById("first-name");
 const lastName = document.getElementById("last-name");




   signupBtn &&  signupBtn.addEventListener("click", async (e) => {  
        e.preventDefault();

        
 if(!signupEmail.value){
  Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'please enter a valid email address',
     
  });
  return
}

if(!signupPass.value){
  Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'please enter atleast six characters password',
     
  });
  return
  
}

        const {data, error } = await supabase.auth.signUp(
  {
    email: signupEmail.value,
    password: signupPass.value,
    options: {
      data: {
        first_name: firstName.value,
        last_name: lastName.value,
        role: 'user'   // for security purpose : so that only admin has access of  dashboard 
      }
    }
  }
)

  if(data){
  
      
    
    console.log (data);
    console.log (data.user);
     console.log (data.user.id);
    //  console.log (data.user.email);
    // console.log (data.user.user_metadata);
    // console.log(data.user.user_metadata.first_name);
    // console.log(data.user.user_metadata.last_name);
    // console.log(data.user.user_metadata.role);
    // console.log(data.user.user_metadata.email);
    const { error } = await supabase
  .from('customers')
  .insert({
    uid: data.user.id,  // store auth id in table so that login user connect with database
    first_name: data.user.user_metadata.first_name,
    last_name: data.user.user_metadata.last_name,
    email: data.user.email,
    role: data.user.user_metadata.role
 
})
if(error){
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
    });
}else{

alert("Signup successful! Please verify your email before logging in.");
window.location.href = "home.html";
}
    }

  });


  //  ======================================================== login functionality =================================================================================================


  let loginEmail = document.getElementById("login-email")
  let loginPass = document.getElementById("login-password")
  let  loginBtn = document.getElementById("login-btn")


  async  function login(){

    e.preventDefault();

        
    if(!loginEmail.value){
     Swal.fire({
         icon: 'error',
         title: 'Error',
         text: 'please enter a valid email address',
        
     });
     return
   }
   
   if(!loginPass.value){
     Swal.fire({
         icon: 'error',
         title: 'Error',
         text: 'please enter atleast six characters password',
        
     });
     return
     
   }
  
  }
