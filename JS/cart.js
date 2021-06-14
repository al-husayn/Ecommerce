let myCart = [];
let discount = 0;
let itemsQuantity = 0;
let subTotal = 0;
const applyingPromoCode = () =>{
    let passed = false;
    let inputValue = document.querySelector('div.promotion div input[type="text"]').value;
    if(inputValue.length > 5){
        passed = false;
    }
    else if(inputValue.length < 5){
        passed = false;
    }
    else{
        let re = new RegExp('[a-z0-9A-Z]{5}');
        passed = re.test(inputValue);
    }
    if(passed){
        discount = 0.5;
    }
    else{
        discount = 0;
    }
    applyPromoToCode();
}

const applyPromoToCode = () => {
    document.querySelector('div.calculation > div.discount').innerHTML = `${discount*100}%`;
    if(discount === 0){
        document.querySelector('div.calculation > div.estimatedTotal').innerHTML = `$${subTotal}`;
    }else{
    document.querySelector('div.calculation > div.estimatedTotal').innerHTML = `$${discount * subTotal}`;
    }
}

const getTotalItems = () => {
    let cartContents = JSON.parse(localStorage.getItem('myCart'));
    for(let i of cartContents){
        itemsQuantity += parseInt(i.productQuantity);
    }
    document.querySelector('div.cart > span.cart-count').innerHTML = itemsQuantity;
    document.querySelector('div.head > span > span.cart-count').innerHTML = itemsQuantity;
    document.querySelector('h1 span.cartItems').innerHTML = itemsQuantity;
 }

 const getSubTotal = () =>{
     let cartContents = JSON.parse(localStorage.getItem('myCart'));
     for(let i of cartContents){
        subTotal += parseInt(i.productQuantity) * parseInt(i.productPrice);
     }
     let subTotalCont = document.querySelector('div.calculation > div.subtotalAmount');
     subTotalCont.innerHTML += `$${subTotal}`;
     document.querySelector('div.calculation > div.estimatedTotal').innerHTML = `$${subTotal}`;
 }

 getSubTotal();

getTotalItems();

window.onload = () => {
    if(localStorage.getItem('myCart') !== null){
        myCart = JSON.parse(localStorage.getItem('myCart'));
    }else{
        console.log("Empty Cart");
    }
    generateHTML(myCart);
        
}

const generateHTML = cartContent =>{
    const mainCartContent = document.querySelector('div.cartContents');
    for(let content of cartContent){
        let cartItem = document.createElement('div');
        mainCartContent.appendChild(cartItem);
        cartItem.innerHTML = `
        <div class="bag-contents">
        <div class="bag-products">
            <div class="bag-product">
                <div class="product-description">
                    <div class="product-image"><img src="${content.cartImage}" alt="product-image" width="110%"></div>
                    <div class="bag-info">
                        <p>${content.productName}</p>
                        <p><span class="bolden">Style:</span> 
                            ${content.productStyle} 
                            <span class="bolden">Color:</span> ${content.productColor}
                        </p>
                        <p><span class="bolden">Size: </span>${content.productSize}
                        </p>
                        <p class="edit-area">
                            <a href="">Edit</a> | <a href="">Move to Wishlist </a>| <a href="">Remove</a> 
                        </p>
                    </div>
                </div>
                <div>
                        <div class="product-quantity-update">
                            <div class="qnty-edit">
                                <select id="ProductsNumb">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                    <option value="9">9</option>
                                    <option value="10">10</option>
                                  </select>
                            </div>
                            <div class="priceInfo">
                                <span class="unitPrice">UNIT PRICE</span><br>
                                <span class="unitPriceAmount">@ <span class="amountPrice"></span> <span class="currency">$</span>${content.productPrice}</span>
                            </div>
                            
                        </div>
                       <p>
                        <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike"> Free gift package?
                       </p> 
                </div>
                <div class="product-total-price">
                    <span class="currency">$</span><span class="amount">${content.productPrice * content.productQuantity}</span>
                    
                </div>
            </div>
            

        </div>

         </div>
        
        `   
    }

    let selectElements = Array.from(document.querySelectorAll('select'));
for(let i in selectElements){
    selectElements[i].selectedIndex = myCart[i]['productQuantity'] - 1;
}

productQuantityUpdate(selectElements);

let removeProduct = document.querySelectorAll('p.edit-area > a:nth-child(3)');
removeProduct.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        let contents = e.target.parentElement.parentElement.children;    
        let pIndex = extractText(contents);  
        if(pIndex > -1){
            myCart.splice(pIndex, 1);
            localStorage['myCart'] = JSON.stringify(myCart);
            handleReloading();    
        }
        
    }, false);

})  
}


let first = document.querySelector('div.promotion div input[type="button"]');
first.addEventListener('click', applyingPromoCode,false);

const handleReloading = _ => {
    document.querySelector('div.cartContents').innerHTML = '';
    generateHTML(myCart);
    document.querySelector('div.calculation > div.estimatedTotal').innerHTML = '';
    document.querySelector('div.calculation > div.subtotalAmount').innerHTML = '';
    itemsQuantity = 0;
    subTotal = 0;
    
    getTotalItems();
    getSubTotal();

}

const extractText = element => {
    let pName = element[0].innerText;
        let pStyle = element[1].innerText.slice(7,13);
        let pColor = element[1].innerText.slice(21);
        let pSize = element[2].innerText.slice(5);
        let pIndex = myCart.findIndex(x =>{
            return (x.productName === pName && 
                    x.productStyle === pStyle && 
                    x.productColor === pColor && 
                    x.productSize.trim() === pSize.trim()
                );
            } );
            return pIndex; 
}

const productQuantityUpdate = selectElements => {
    for(let i of selectElements){
        i.addEventListener('change', (e) =>{
            let targetedElement = e.target;
            let newQuantity = targetedElement.options[targetedElement.selectedIndex].value;
            let containerElement = targetedElement.parentElement.parentElement.parentElement.previousElementSibling;
            let contents = containerElement.children[1].children;
            let pIndex = extractText(contents); 
            if(pIndex > -1){
                myCart[pIndex].productQuantity = newQuantity;
                localStorage['myCart'] = JSON.stringify(myCart);
                handleReloading();
            }
              
        }, false);

        
    }
}

