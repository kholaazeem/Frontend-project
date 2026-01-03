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
let colorName = document.querySelectorAll(".color-name-inp");
let colorHex = document.querySelectorAll(".color-hex-inp");




    // 1. New Color Field Add karne ka function
   window. addColorField = function() {
        // Container dhoondo
        const container = document.getElementById('colors-container');

        // Nayi row create karo (HTML string)
        const newRow = document.createElement('div');
        newRow.classList.add('row', 'mb-2', 'color-row');
        
        newRow.innerHTML = `
            <div class="col-7">
                <input type="text" class="form-control color-name-inp " placeholder="Color Name" name="colorName[]">
            </div>
            <div class="col-3">
                <input type="color" class="form-control form-control-color w-100  color-hex-inp" value="#000000" name="colorHex[]">
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

          
    //    session storage for product image 

    let imageUrl;

    async function uploadFile(){
     let file = prodImg.files[0];
     let fileName = `${Date.now()}-${file.name}`

   try {
    
   
const { data, error } = await supabase
  .storage
  .from('product-images')
  .upload(fileName, file, )
   if (data) {
    console.log("File uploaded successfully:", data);
    // Get public URL
    const { data: urlData } = supabase
      .storage
      .from('product-images')
      .getPublicUrl(fileName);

      if(urlData){
        imageUrl = urlData.publicUrl;
        console.log("Public URL:", imageUrl);
      }else{
        console.log("Error in uploding file:", error);
      }
   }  
    
   
  
    }
      catch (err) {
    console.log("try catch error:", err);
   } 
   return imageUrl;
    }

  async function submitProd(event){
    event.preventDefault(); 

           //collect all inputs value and colors 
    let allColorName = document.querySelectorAll(".color-name-inp");
    let allColorHex = document.querySelectorAll(".color-hex-inp");
    console.log(allColorName, allColorHex);

    //  array to store colors
    let colorArray = [];

    allColorName.forEach((colorInp, index)=>  {
        let name = colorInp.value;
        let hex = allColorHex[index].value
        console.log(name ,hex)

        if(name.trim() !== "" ) {
           colorArray.push({
            name : name,
            hex : hex
           })
        }
    })



      //    Submit products in tables/DB
    
}
  

prodForm.addEventListener("submit", submitProd);