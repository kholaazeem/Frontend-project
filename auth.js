import supabase from "./config.js";  


            //  Sign Up Functionality

 const signupBtn = document.getElementById("signup-btn");                    
 const signupEmail = document.getElementById("signup-email");
 const signupPass = document.getElementById("signup-pass");
 const firstName = document.getElementById("first-name");
 const lastName = document.getElementById("last-name");


 if(!signupEmail){
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'please enter a valid email address',
        
    });
    return
 }
 if(!signupPass){
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'please enter atleast six characters password',
       
    });
     return
 }

    signupBtn.addEventListener("click", async (e) => {  
        e.preventDefault();

        const { data, error } = await supabase.auth.signUp(
  {
    email: signupEmail.value,
    password: signupPass.value,
    options: {
      data: {
        first_name: firstName.value,
        last_name: lastName.value,
        role: 'user'
      }
    }
  }
)
  if(data){
    // console.log (data);
    // console.log (data.user);
    //  console.log (data.user.id);
    //  console.log (data.user.email);
    // console.log (data.user.user_metadata);
    // console.log(data.user.user_metadata.first_name);
    // console.log(data.user.user_metadata.last_name);
    // console.log(data.user.user_metadata.role);
    // console.log(data.user.user_metadata.email);
    const { error } = await supabase
  .from('customers')
  .insert({
    uid: data.user.id,
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
window.location.href = "login.html";
}





  }
  
    });