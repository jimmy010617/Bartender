"use strict";

const shopItemList = document.querySelector(".shop_itemList");
const searchBox = document.querySelector("#searchBox");

function loadItems() {
    return fetch("./store.json")
    .then((res) => res.json())
    .then((json) => json.products);
}

function displayShopItems(products) {
    shopItemList.innerHTML = products
        .map((product) => creatShopItem(product))
        .join("");
}

// 상품 종류 정의
function creatShopItem(product) {
    return `<div data-id=${product.id} class="shop_itemList_item" draggable="true">
    <img src=./${product.photo} alt="shopItemImg" class="shop_itemList_img" draggable="false">
    <h3 class="shop_itemList_item_productName">
        ${product.product_name}
    </h3>
    <span class="shop_itemList_item_branName">
        ${product.brand_name}
    </span>
    <span class="shop_itemList_item_price">
        ${product.price}
    </span>
</div>`;    
}

// 상품 검색창 필터
function searchFiilter() {
    const value = searchBox.value.toLowerCase();
    const shopItemName = document.querySelectorAll(
        ".shop_itemList_item"
    );
    
    shopItemName.forEach((item) => {
        const productName = item.querySelector(".shop_itemList_item_productName").innerText.toLowerCase();
        const brandName = item.querySelector(".shop_itemList_item_branName").innerText.toLowerCase();
        
        // 검색어가 제품명 또는 brand_name에 포함되어 있는지 확인
        const matchesSearch = productName.includes(value) || brandName.includes(value);

        if (matchesSearch) {
            showOrHideItem(item, "flex");
        } else {
            showOrHideItem(item, "none");
        }
    });
}

function showOrHideItem(target, showOrHide) {
    target.style.display = `${showOrHide}`;
}

// 상품 검색 필터 (버튼 클릭 시 필터링)
function filterByCategory(category) {
    const shopItemName = document.querySelectorAll(".shop_itemList_item");
    
    shopItemName.forEach((item) => {
        const brandName = item.querySelector(".shop_itemList_item_branName").innerText.toLowerCase();
        
        // 버튼의 카테고리 이름이 brand_name에 포함되어 있는지 확인
        const matchesCategory = brandName.includes(category.toLowerCase());

        if (matchesCategory) {
            showOrHideItem(item, "flex");
        } else {
            showOrHideItem(item, "none");
        }
    });
}

function showOrHideItem(target, showOrHide) {
    target.style.display = `${showOrHide}`;
}

// 버튼 클릭 이벤트 추가
document.querySelectorAll('.navbar_button').forEach(button => {
    button.addEventListener('click', () => {
        const category = button.getAttribute('data-category');
        filterByCategory(category); // 필터링 함수 호출
    });
});

function dragEvent() {
    const shopItem = document.querySelectorAll(".shop_itemList_item");
    const dropArea = document.querySelector(".cart_cartBox_dropArea");

    for (let i = 0; i < shopItem.length; i++) {
        shopItem[i].addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text", e.target.dataset.id);
        });
    }

    dropArea.addEventListener("dragover", dragOverHandler);
    dropArea.addEventListener("drop", dropHandler);
}

function creatCartItem(i) {
    const shopItem = document.querySelectorAll(".shop_itemList_item");
    const shopItemImg = document.querySelectorAll(".shop_itemList_img");
    const shopItemName = document.querySelectorAll(
        ".shop_itemList_item_productName"
    );
    const shopItemBrand = document.querySelectorAll(
        ".shop_itemList_item_branName"
    );
    const shopItemPrice = document.querySelectorAll(
        ".shop_itemList_item_price"
    );
    return `<div class="cart_cartBox_itemList_item" data-id='${shopItem[i].dataset.id}'>
    <img src="${shopItemImg[i].src}" alt="cartItemImg">
    <h3 class="cartItem_productName">
        ${shopItemName[i].innerText}
    </h3>
    <span class="cartItem_brandName">
    ${shopItemBrand[i].innerText}
    </span>
    <form>
        <label class="cartItemQuantity">수량</label>
        <input type="number" class="cartItemInput" data-id-input='${shopItem[i].dataset.id}' value=0>
        <input type="text" style="display:none">
    </form>
    <span class="cartItem_price" data-price='${shopItemPrice[i].innerText}'>${shopItemPrice[i].innerText}</span>
    <button class="removeBtn">X</button> <!-- 상품 삭제 버튼 -->
    </div>`;
}

function dropHandler(e) {
    const cartItemList = document.querySelector(".cart_cartBox_itemList");
    const dataId = e.dataTransfer.getData("text");
    const exists = document.querySelectorAll(`[data-id='${dataId}']`);

    if (exists.length < 2) {
        cartItemList.insertAdjacentHTML("beforeend", creatCartItem(dataId));
        increaseQuantity(dataId);
        updateCart();
    } else {
        increaseQuantity(dataId);
        updateCart();
    }
    writeInputBox();
    addRemoveButton(); // 삭제 버튼 추가
}

// 삭제 버튼
function addRemoveButton() {
    const removeBtns = document.querySelectorAll(".removeBtn");

    removeBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const cartItem = e.target.closest(".cart_cartBox_itemList_item");
            cartItem.remove();
            updateCart(); // 총합 업데이트
        });
    });
}

// 새로고침 버튼
function ResetButton() {
    const resetBtns = document.querySelectorAll(".reset_button")

    resetBtns.addEventListener("click", function() {
        location.reload();
    });
}

function dragOverHandler(e) {
    e.preventDefault();
}

function increaseQuantity(id) {
    const cartItemInput = document.querySelector(`[data-id-input='${id}']`);
    cartItemInput.value = Number(cartItemInput.value) + 1;
}

function updateCart() {
    const cartItemQuantity = document.querySelectorAll(".cartItemInput");
    const cartItemPrice = document.querySelectorAll(".cartItem_price");
    const totalPrice = document.querySelector(".cart_cartBox_totalPrice");

    for (let i = 0; i < cartItemPrice.length; i++) {
        cartItemPrice[i].innerText = `${
            cartItemPrice[i].dataset.price * Number(cartItemQuantity[i].value)
        }`;
    }

    let total = 0;
    cartItemPrice.forEach(function (e) {
        total = total + Number(e.innerText);
    });

    totalPrice.innerText = total;
}

/* window.addEventListener('scroll', () => {
    const cart = document.querySelector('.cart_cartBox');
    const scrollY = window.scrollY;

    cart.style.transform = `translateY(${scrollY * 0.2}px)`;
}); */

// 스크롤 이벤트 리스너
window.addEventListener('scroll', () => {
    // 스크롤 위치가 100px 이상일 때 위로 가기 버튼을 보이게 함
    if (
      document.body.scrollTop > 100 ||
      document.documentElement.scrollTop > 20
    ) {
      document.getElementById('btn-back-to-top').style.display = 'block';
    } else {
      document.getElementById('btn-back-to-top').style.display = 'none';
    }
  });
  
  // 클릭 시 페이지 맨 위로 스크롤 (애니메이션 효과 추가)
  function backToTop() {
    const position =
      document.documentElement.scrollTop || document.body.scrollTop;
    if (position) {
      window.requestAnimationFrame(() => {
        window.scrollTo(0, position - position / 10);
        backToTop();
      });
    }
  }

function writeInputBox() {
    const cartItemQuantity = document.querySelectorAll(".cartItemInput");
    cartItemQuantity.forEach((input) => {
        input.addEventListener("input", () => {
            if (parseInt(input.value) < 0) {
                input.value = 0;
            }
            updateCart();
        });
    });
}

function clickPurchaseBtn() {
    const container = document.querySelector(".cart");
    container.addEventListener("click", clickPurchaseEvent);
}

function clickPurchaseEvent(e) {
    const cartItemList = document.querySelector(".cart_cartBox_itemList");
    const purchaseBtn = document.querySelector(".cart_cartBox_purchaseBtn");
    const blackBackground = document.querySelector(".blackBackground");
    const modal = document.querySelector(".purchase_modal");
    const modalSubmitBtn = document.querySelector(".purchase_modal_submitBtn");
    const cancelPurchaseBtn = document.querySelector(
        ".purchase_modal_cancelBtn"
    );
    const receipt = document.querySelector(".receiptContainer");
    const receiptBtn = document.querySelector(".receiptBtn");

    if (e.target.tagName !== "BUTTON" && e.target.tagName !== "INPUT") {
        return;
    }
    if (e.target == purchaseBtn) {
        if(!cartItemList.hasChildNodes()) {
            alert("상품을 담아주세요.");
        } else {
            scrollToTop();
            showOrHideItem(blackBackground, "block");
            showOrHideItem(modal, "block");
        }
    }
    if (e.target == cancelPurchaseBtn) {
        showOrHideItem(blackBackground, "none");
        showOrHideItem(modal, "none");
    }
    if (e.target == modalSubmitBtn) {
        updateReceipt();
        showOrHideItem(modal, "none");
        showOrHideItem(receipt, "block");
    }
    if (e.target == receiptBtn) {
        showOrHideItem(receipt, "none");
        showOrHideItem(blackBackground, "none");
    }
}

function scrollToTop() {
    scrollTo(0, 0);
}

// 영수증 출력
function updateReceipt() {
    const today = new Date();
    const cartItemName = document.querySelectorAll(".cartItem_productName");
    const cartItemBrand = document.querySelectorAll(".cartItem_brandName");
    const cartItemQuantity = document.querySelectorAll(".cartItemInput");
    const cartItemPrice = document.querySelectorAll(".cartItem_price");
    const totalPrice = document.querySelector(".cart_cartBox_totalPrice");
    const receipt = document.querySelector("#receipt");
    const ctx = receipt.getContext("2d");

    // 영수증 확인 후 페이지 새로고침
    const receiptContainer = document.querySelector(".receiptContainer");
    const receiptBtn = document.querySelector(".receiptBtn");

    receiptBtn.addEventListener("click", function() {
        receiptContainer.style.display = "none";
        location.reload();
    });

    // 기본 영수증 제목과 날짜
    ctx.font = "20px serif";
    ctx.fillText("영수증", 30, 50);
    ctx.font = "12px serif";
    ctx.fillText(today.toLocaleDateString(), 30, 70);
    ctx.fillText(today.toLocaleTimeString(), 120, 70);

    for (let i = 0; i < cartItemName.length; i++) {
        ctx.font = "16px serif";
        ctx.fillText(` 제품명 : ${cartItemName[i].innerText}`, 30, 100 * (i + 1));
        ctx.fillText(
            ` 기주 : ${cartItemBrand[i].innerText}`, 
            30, 
            100 * (i + 1) + 20
        );
        ctx.fillText(
            ` 수량 : ${cartItemQuantity[i].value}개`, 
            30, 
            100 * (i + 1) + 40
        );
        ctx.fillText(
            ` 금액 : ${cartItemPrice[i].innerText}원`, 
            30, 
            100 * (i + 1) + 60
        );
    }
    ctx.fillText(` 총액 : ${totalPrice.innerText}원`, 400, 500);
}

loadItems() 
    .then((products) => {
        displayShopItems(products);
    })
    .then(() => {
        dragEvent();
        clickPurchaseBtn();
        searchBox.addEventListener("keyup", searchFiilter);
    });