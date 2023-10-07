let productos = []

fetch("./js/componentes-js/productos.json")
    .then(response => response.json())
    .then(data => {
        productos = [...data]
        mostrarProductos(productos)        
        manageCartButtons()
        manageCart()
})

// Elementos DOM
const contenedorProductos = document.getElementById('productos__card-container')
const carritoContainer = document.getElementById('carrito')


const carrito = JSON.parse(localStorage.getItem('carrito')) || []

class Producto {
    constructor(id, nombre, img, precio, categoria, cantidad) {
        this.id = id;
        this.nombre = nombre;
        this.img = `./Recursos/imgs/ProductosPNG/${img}.png`;
        this.precio = precio;
        this.categoria = categoria;
        this.cantidad = cantidad;
    }
}

const addProducto = (array, id, nombre, img, precio, categoria, cantidad) => {
    const nuevoProducto = new Producto(id, nombre, img, precio, categoria, cantidad);
    array.push(nuevoProducto)
}


const manageCart = () => {
    
    if(carrito.length > 0) {
        for(let producto of carrito) {
            let carritoItem = document.createElement('li')
            carritoItem.innerHTML = `
                <div class="cart__tarjeta">
                    <h6>${producto.nombre}</h6>
                    <div class="cart__precio-cantidad">
                        <p class="cart__precio">$${(producto.precio * producto.cantidad)}</p>
                        <p>${producto.cantidad}</p>
                    </div>
                </div>
                <button class='remove-btn' id='${producto.id}'>Quitar</button>
            `
            carritoContainer.append(carritoItem)
        }
    } else {
        const textCart = document.createElement('p')
        textCart.innerHTML = 'El carrito esta vacio'
        carritoContainer.append(textCart)
    }
    removeCartItem()
}

// ESTA funcion no me convence, y por alguna razon no funciona a la primer, tengo que recargar la pagina antes 
const removeCartItem = () => {
    const removeBtns = document.querySelectorAll('.remove-btn')
    for(boton of removeBtns) {
        boton.onclick = (e) => {
            const productoId =  parseInt(e.target.id)
            const indexProducto = carrito.findIndex(prod => prod.id === productoId)
            const carritoContainer = document.getElementById('carrito')
            carrito.splice(indexProducto, 1)
            localStorage.setItem('carrito', JSON.stringify(carrito))
            carritoContainer.innerHTML = ''
            manageCart()
        }
    }
    
}


const mostrarProductos = (array) => {
    for(const producto of array) {
        let productoCard = document.createElement('div')
        productoCard.classList.add('product-card')
        productoCard.innerHTML = `
        <img src='${producto.img} ' class='product-img card-img-top'>
        <h5>${producto.nombre}</h5>
        <p>$${producto.precio}</p>

        <div class='product-card__buttons'>
            <button id='${producto.id}' class='btn__add-to-cart '>Add</button>
        </div>
        `
        contenedorProductos.append(productoCard)
    }
}


function addToCart(p) {
    const respuesta = carrito.includes(p)
    const addMore = () => {
        const productoActual = carrito.find((producto) => producto === p)
        productoActual.cantidad ++
    }

    const addProd = () => {
        p.cantidad ++
        carrito.push(p)
    }

    respuesta === true ? addMore() : addProd()
    swal({
        icon: 'success',
        title: `Se agrego ${p.nombre}`,
        timer: 1500 
    }) 
    manageCart()
}



const manageCartButtons = () => {
    
    const botonesCarrito = document.getElementsByClassName('btn__add-to-cart')
    for(boton of botonesCarrito) {
        boton.onclick = (e) => {
            const productoSeleccionado = productos.find((producto) => producto.id === parseInt(e.target.id))
            carritoContainer.innerHTML = ''
            addToCart(productoSeleccionado)
            localStorage.setItem('carrito', JSON.stringify(carrito))
        }
    }
}

const limpiarCarrito = () => {
    localStorage.clear()
}


manageCartButtons()
removeCartItem()
