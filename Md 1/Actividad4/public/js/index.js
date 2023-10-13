(function() {
    const socket = io('http://localhost:8080'); 

    socket.on('newProduct', (product) => {
        const productDiv = document.createElement('div');
        productDiv.id = product.id;

        const title = document.createElement('h2');
        title.innerText = `Title: ${product.title}`;
        productDiv.appendChild(title);
        
        const id = document.createElement('h5');
        id.innerText = `Id: ${product.id}`;
        productDiv.appendChild(id);
        
        const description = document.createElement('h5');
        description.innerText = `Description: ${product.description}`;
        productDiv.appendChild(description);
        
        const price = document.createElement('h5');
        price.innerText = `Price: ${product.price}`;
        productDiv.appendChild(price);

        const code = document.createElement('h5');
        code.innerText = `Code: ${product.code}`;
        productDiv.appendChild(code);

        const stock = document.createElement('h5');
        stock.innerText = `Stock: ${product.stock}`;
        productDiv.appendChild(stock);

        const status = document.createElement('h5');
        status.innerText = `Status: ${product.status}`;
        productDiv.appendChild(status);

        const category = document.createElement('h5');
        category.innerText = `Category: ${product.category}`;
        productDiv.appendChild(category);

        const thumbnail = document.createElement('h5');
        thumbnail.innerText = `Thumbnail: ${product.thumbnail}`;
        productDiv.appendChild(thumbnail);

        const container = document.querySelector('.container');  
        container.appendChild(productDiv);
    });

    socket.on('removeProduct', (id) => {
        const productToRemove = document.getElementById(id);
        if (productToRemove) { 
            productToRemove.remove();
        }
    });
})();
