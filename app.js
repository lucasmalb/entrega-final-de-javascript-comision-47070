const cards = document.getElementById('cards');
const Items = document.getElementById('items');
const footer = document.getElementById('footer');
const templateCard = document.getElementById('template-card').content;
const templateCarrito = document.getElementById('template-carrito').content;
const templateFooter = document.getElementById('template-footer').content;
const fragment = document.createDocumentFragment();
let carrito =  JSON.parse(localStorage.getItem("carrito")) || [];


document.addEventListener('click', e => {
    addCarrito(e);
});

document.addEventListener('DOMContentLoaded', () => {
    fetchData();
    cargarCarritoDesdeLocalStorage();
});

const fetchData = async () => {
    try {
        const res = await fetch('./api.json');
        const data = await res.json();
        pintarCards(data);
    } catch (error) {
        console.log(error);
    }
};

const pintarCards = data => {
    data.forEach(producto => {
        const clone = templateCard.cloneNode(true);
        clone.querySelector('h5').textContent = producto.titulo;
        clone.querySelector('p').textContent = producto.precio;
        clone.querySelector('img').setAttribute('src', producto.foto);
        clone.querySelector('.btn-dark').dataset.id = producto.id;

        fragment.appendChild(clone);
    });
    cards.appendChild(fragment);
};

const addCarrito = e => {
    if (e.target.classList.contains('btn-dark')) {
        setCarrito(e.target.parentElement);
    }
    e.stopPropagation();
    guardarCarritoEnLocalStorage();
};

const setCarrito = objeto => {
    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        titulo: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1
    };

    const carritoProducto = carrito.find(item => item.id === producto.id);

    if (carritoProducto) {
        carritoProducto.cantidad++;
    } else {
        carrito.push(producto);
        Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Producto agregado correctamente',
          })
    }

    pintarCarrito();
};


const guardarCarritoEnLocalStorage = () => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
};

const cargarCarritoDesdeLocalStorage = () => {
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'));
        pintarCarrito();
    }
};

const pintarCarrito = () => {
    Items.innerHTML = '';
    carrito.forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id;
        templateCarrito.querySelectorAll('td')[0].textContent = producto.titulo;
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad;
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id;
        templateCarrito.querySelector('.btn-secondary').dataset.id = producto.id;
        templateCarrito.querySelector('span').textContent = producto.cantidad * parseFloat(producto.precio);

        const clone = templateCarrito.cloneNode(true);
        fragment.appendChild(clone);
    });
    Items.appendChild(fragment);

    carrito.forEach(producto => {
        const btnInfo = document.querySelector(`.btn-info[data-id ="${producto.id}"]`);
        const btnSecondary = document.querySelector(`.btn-secondary[data-id ="${producto.id}"]`);
    
        btnInfo.addEventListener('click',(e) =>{
            btnAccion(e, producto.id);
        })
        btnSecondary.addEventListener('click',(e) =>{
            btnAccion(e, producto.id);
        })
    })
};


const pintarFooter = () => {
    footer.innerHTML = '';
    const totalQuantity = carrito.reduce((acc, { cantidad }) => acc + cantidad, 0);
    const totalPrice = carrito.reduce((acc, { cantidad, precio }) => acc + cantidad * parseFloat(precio), 0);

    const row = document.createElement('tr');
    const colCantidad = document.createElement('td');
    const botonVaciar = document.createElement('button');
    botonVaciar.textContent = 'Vaciar Carrito';
    botonVaciar.setAttribute('id', 'vaciar-carrito');
    botonVaciar.classList.add('btn');
    botonVaciar.classList.add('btn-danger');
    colCantidad.textContent = 'Total productos';
    colCantidad.setAttribute('colspan', '2');

    const colBoton = document.createElement('td');
    colBoton.textContent = totalQuantity;

    const colTotal = document.createElement('td');
    colTotal.setAttribute('colspan', '2');
    colTotal.classList.add('text-end');
    colTotal.innerHTML = `Total: $ <span>${totalPrice.toFixed(2)}</span>`;

    row.appendChild(colCantidad);
    row.appendChild(colBoton);
    row.appendChild(colTotal);
    row.appendChild(botonVaciar);  // Agregar el botón "Vaciar Carrito" al footer
    footer.appendChild(row);

    const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
    vaciarCarritoBtn.addEventListener('click', () => {
        carrito = [];
        pintarCarrito();

    });
};

cards.addEventListener('click', e => {
    addCarrito(e);
});
const btnAccion = (e,prodid)=>{
    const producto = carrito.find (item => item.id == prodid);
    if (e.target.classList.contains ('btn-info')){
        producto.cantidad++
    }

    if (e.target.classList.contains ('btn-secondary')){
        producto.cantidad--
    }
    carrito = carrito.filter(item => item.cantidad > 0);

    pintarCarrito ();
};
pintarFooter ()


