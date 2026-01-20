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

if(window.location.pathname.includes("/admin/")){  //includes check pathname 
checkAdmin();
}

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
  console.log(file , fileName)
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



      //    add/insert products in tables/DB
    
      let imageAdd = await uploadFile()
      // console.log(imageAdd)

      try {
        const { error } = await supabase
  .from('products')
  .insert({ 
     name: prodName.value, 
     category: prodCateg.value,
     price: prodPrice.value,
     description: prodDesc.value,
     image: imageAdd,
     color: colorArray
    })
    if(error){
      console.log("error in inserting data in db/table" + error)
    }else{
      alert("product added in tables suucessfully")
      showProducts()
    }
      } catch (err) {
        console.log("try catch error" + err)
      }
}
  

prodForm && prodForm.addEventListener("submit", submitProd);


// fetch data from database/tables


 let productList = document.getElementById("product-list")

async function showProducts() {
   const isAdminPage = window.location.pathname.includes("/admin/");//ab admin login ho ga but home page pr edit delte nhi dikhy ga

    try {

        // --- CHANGE 1: START (Role Check) ---
        // Loop chalne se pehle check karo k banda Admin hai ya nahi
        let isAdmin = false; 

        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            // Agar user login hai, to uska role pucho
            const { data: userProfile } = await supabase
                .from('customers')
                .select('role')
                .eq('uid', user.id)
                .single();
            
            // Agar role 'admin' hai to flag TRUE kar do
            if (userProfile && userProfile.role === 'admin') {
                isAdmin = true;
            }
        }
        // --- CHANGE 1: END ---
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) {
            productList.innerHTML = "";  //its for supabase bcz in supabase previos data also saved 
            let cardsHTML = '<div class="row g-4">';

            data.forEach(product => {
                
                // Colors Loop
                let colorBadges = '';
                if (Array.isArray(product.color)) {
                    colorBadges = product.color.map(c => 
                        `<span class="color-swatch" 
                               style="background-color: ${c.hex};" 
                               title="${c.name}">
                        </span>`
                    ).join('');
                }

                // --- CHANGE 2: START (Button Logic) ---
                
                let adminButtons = ''; // Default khali rakho (Aam user ke liye)

                // Agar CHANGE 1 mein confirm hua k ye Admin hai, tabhi buttons banao
                if (isAdmin === true && isAdminPage === true) {
                    adminButtons = `
                        <div class="admin-actions">
                            <button class="action-btn text-primary" onclick="editProduct(${product.id})" title="Edit">
                                <i class="fa-solid fa-pen"></i>
                            </button>
                            <button class="action-btn text-danger" onclick="deleteProduct(${product.id})" title="Delete">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    `;
                }
                // --- CHANGE 2: END ---

                // Card HTML
                cardsHTML += `
                   <div class="col-xl-3 col-lg-4 col-md-6 col-sm-12">
                    <div class="card product-card h-100">
                        
                        <div class="img-container">
                            <img src="${product.image}" class="card-img-top" alt="${product.name}">
                            
                            ${adminButtons}
                        </div>

                        <div class="card-body d-flex flex-column pt-3">
                            <div class="text-muted text-uppercase fw-bold" style="font-size: 10px; letter-spacing: 1px;">
                                ${product.category}
                            </div>

                            <div class="d-flex justify-content-between align-items-center mt-2 mb-2">
                                <h6 class="card-title fw-bold mb-0 text-dark text-truncate" style="max-width: 70%;">
                                    ${product.name}
                                </h6>
                                <span class="fw-bold" style="color: #2c3e50; font-size: 1.1rem;">
                                    Rs. ${product.price}
                                </span>
                            </div>

                            <p class="text-muted small mb-3" style="font-size: 0.85rem; line-height: 1.4;">
                                ${product.description ? product.description.substring(0, 45) + '...' : ''}
                            </p>
                            <div >Available Colors:
                            </div>
                            <div class="mt-auto mb-3">
                                ${colorBadges}
                            </div>

                            <button class="btn btn-dark w-100 rounded-pill py-2" style="font-size: 0.9rem;" onclick="goToDetail(${product.id})">
                                View Details
                            </button>
                        </div>
                    </div>
                </div>
                `;
            });

            cardsHTML += '</div>';
            productList.innerHTML = cardsHTML;
        } else {
            console.log(error);
        }

    } catch (err) {
        console.log(err);
    }
}

window.goToDetail = function(productId) {
    window.location.href = `../viewDetail.html?id=${productId}`;
}

showProducts();

export { showProducts };