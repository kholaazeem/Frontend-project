let productCard = document.getElementById("product-card");

// Function to get query parameters
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Function to fetch and display product details
async function displayProductDetails() {
    const productId = getQueryParam('id');
    if (!productId) {
        productCard.innerHTML = "<p>Product ID not found in URL.</p>";
        return;
    }

    const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

    if (error || !product) {
        productCard.innerHTML = "<p>Product not found.</p>";
        return;
    }

    productCard.innerHTML = `
        <div class="card shadow-sm border-0 m-4 p-4">
            <h2>${product.name}</h2>
            <img src="${product.image_url}" alt="${product.name}" class="img-fluid mb-3"/>
            <p>${product.description}</p>
            <h4>Price: $${product.price}</h4>
            <h5>Available Colors: ${product.colors.join(', ')}</h5>
        </div>
    `;
}

displayProductDetails();