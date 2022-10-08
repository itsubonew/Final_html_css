class CartItem{
    constructor(name,img,price){
        this.name = name
        this.img = img
        this.price = price
        this.quantity = 1
    }
}

class LocalCart{
    static key = "cartItems"

    static getLocalCartItems(){
        let cartMap = new Map()
        const cart = localStorage.getItem(LocalCart.key)
        if(cart === null || cart.length === 0) return cartMap
        return new Map(Object.entries(JSON.parse(cart)))
    }

    static addItemToLocalCart(id, item){
        let cart = LocalCart.getLocalCartItems()
        if(cart.has(id)){
            let mapItem = cart.get(id)
            mapItem.quantity +=1
            cart.set(id,mapItem)
        }
        else
        cart.set(id,item)
        localStorage.setItem(LocalCart.key,  JSON.stringify(Object.fromEntries(cart)))
        updateCartUI()

    }

    static removeItemFromCart(id){
        let cart = LocalCart.getLocalCartItems()
        if(cart.has(id)){
            let mapItem = cart.get(id)
            if(mapItem.quantity > 1)
            {
                mapItem.quantity -=1
                cart.set(id,mapItem)
            }
            else
            cart.delete(id)
        }
        if(cart.length === 0)
        localStorage.clear()
        else
        localStorage.setItem(LocalCart.key,  JSON.stringify(Object.fromEntries(cart)))
        updateCartUI()
    }
}

const cartIcon = document.querySelector('.fa-cart-shopping')
const wholeCartWindow = document.querySelector('.whole-cart-window')
wholeCartWindow.inWindow = 0
const addToCartBtns = document.querySelectorAll('#btn')
addToCartBtns.forEach( (btn)=>{
    btn.addEventListener('click', addItemFunction)
})

// addToCartBtns.forEach((btn, index)=>{
//     btn.addEventListener('click', () => addItemFunction(btn))
// })

function addItemFunction(e){
    const id = e.target.parentElement.getAttribute("data-id")
    const parentEl = this.closest('div')
    const img = parentEl.children[0].src
    const name = parentEl.children[1].textContent
    const price = parentEl.children[2].textContent
    const item = new CartItem(name,img,price)
    LocalCart.addItemToLocalCart(id,item)
    console.log(price);
}

cartIcon.addEventListener('mouseover',()=>{
if(wholeCartWindow.classList.contains('hide'))
wholeCartWindow.classList.remove('hide')
})

cartIcon.addEventListener('mouseleave',()=>{
    // if(wholeCartWindow.classList.contains('hide'))
    setTimeout( ()=>{
        if(wholeCartWindow.inWindow === 0){
            wholeCartWindow.classList.add('hide')
        }
    } ,500 )
    
    })

    wholeCartWindow.addEventListener('mouseover',()=>{
        wholeCartWindow.inWindow= 1
    })

    wholeCartWindow.addEventListener('mouseleave',()=>{
        wholeCartWindow.inWindow= 0
        wholeCartWindow.classList.add('hide')
    })

    function updateCartUI(){
        const cartWrapper = document.querySelector('.cart-wrapper')
        cartWrapper.innerHTML=""
        const items = LocalCart.getLocalCartItems()
        if(items === null)return
        let count = 0
        let total = 0
        for(const[key,value]of items.entries()){
            const cartItem = document.createElement('div')
            cartItem.classList.add('cart-item')
            value.price.slice(1,3)
            console.log(typeof value.price)
            let price = value.price.slice(1)*value.quantity
            console.log(value.price.slice(1));
            price = Math.round(price*100)/100
            count +=1
            total += price
            total = Math.round(total*100)/100
            cartItem.innerHTML = `

            <img src="${value.img}">
                                    <div class="item-details">
                                        <h3 class="item-name">${value.name}</h3>
                                        <span class="quantity">Quantity: ${value.quantity}</span>
                                        <span class="price">Price:  ${price}</span>                                   
                                     </div>
                                    <div class="cancel"><i class="fa-solid fa-trash-can"></i></div>`

             cartItem.lastElementChild.addEventListener('click',()=>{
                LocalCart.removeItemFromCart(key)
             })
             cartWrapper.append(cartItem) 
             console.log(value)
      }

      if(count > 0){
        cartIcon.classList.add('non-empty')
        let root = document.querySelector(':root')
        root.style.setProperty('--after-content',`"${count}"`)
        const subtotal = document.querySelector('.subtotal')
        subtotal.innerHTML = `SubTotal: ${total}`
      }
      else
      cartIcon.classList.remove('non-empty')
    }
document.addEventListener('DOMContentLoaded',()=>{updateCartUI})
