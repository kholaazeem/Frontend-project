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



    // 1. Naya Color Field Add karne ka function
   window. addColorField = function() {
        // Container dhoondo
        const container = document.getElementById('colors-container');

        // Nayi row create karo (HTML string)
        const newRow = document.createElement('div');
        newRow.classList.add('row', 'mb-2', 'color-row');
        
        newRow.innerHTML = `
            <div class="col-7">
                <input type="text" class="form-control" placeholder="Color Name" name="colorName[]">
            </div>
            <div class="col-3">
                <input type="color" class="form-control form-control-color w-100" value="#000000" name="colorHex[]">
            </div>
            <div class="col-2">
                <button type="button" class="btn btn-outline-danger w-100" onclick="removeColor(this)">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
            
        `;

        // Container me jod do
        container.appendChild(newRow);
    }

    // 2. Color Field Delete karne ka function
    window.removeColor = function (button) {
        // Jis button par click hua, uski poori row (parent) ko hata do
        const row = button.closest('.color-row');
        
        // Check karo ke kam se kam 1 row bachi rahe (optional)
        const totalRows = document.querySelectorAll('.color-row').length;
        if (totalRows > 1) {
            row.remove();
        } else {
            alert("At least one color is required!");
        }
    }
