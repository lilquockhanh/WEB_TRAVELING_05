/*hai biến sẽ dùng để chạy render card*/
let currentPage = 1;
let recordsPerPage = 9;
let allReviews = []; /*một mảng*/
let placeNameMap={}; /*một object phục vụ giống bảng băm truy vấn đúng dữ liệu tức thời*/
Promise.all([
    /*Lấy dữ liệu từ hai file json, đối với reviewdata.json thì nó sẽ so sánh xem nếu dữ liệu trong localStorge nhiều hơn
    thì nó sẽ không lấy dữ liệu từ reviewdata.json, còn place.json thì vẫn load bình thường*/
    fetch("reviewdata.json").then(res => res.json()),
    fetch("place.json").then(res => res.json())
]).then(([reviewsData, placesData]) => {
    placeNameMap = placesData;
    let localData = JSON.parse(localStorage.getItem("reviews")) || [];
    if (reviewsData.length > localData.length) {
        localStorage.setItem("reviews", JSON.stringify(reviewsData));
        allReviews = reviewsData;
    } else {
        allReviews = localData;
    }
    renderCards(allReviews);
});
window.addEventListener("DOMContentLoaded", () => {
    document.body.classList.remove("fade-out");
    document.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            document.body.classList.add("fade-out");
            setTimeout(() => {
                window.location.href = this.href;
            }, 400);
        });
    });
    /*Khi bấm vào phần tử a tức là phần tử có class review-card add-card sẽ có hiệu ứng chuyển trang sang trang mục tiêu */
});
function renderCards(reviews) {
    /*Hàm render dựa trên pagination chia trang sẽ chỉ render cho mỗi trang 9 phần tử*/
    let container = document.getElementById("mainDisplay");
    if (!container) return;
    container.innerHTML = "";
    let startIndex = (currentPage - 1) * recordsPerPage;
    let endIndex = startIndex + recordsPerPage;
    let paginatedItems = reviews.slice(startIndex, endIndex);
    paginatedItems.forEach((review, i) => {
        createReviewElement(review, startIndex + i);
    });
    setupPagination(reviews);
}
function setupPagination(reviews) {
    const paginationContainer = document.getElementById("pagination");
    if (!paginationContainer) return;
    paginationContainer.innerHTML = "";
    const pageCount = Math.ceil(reviews.length / recordsPerPage); /*tính số trang*/
    if (pageCount <= 1) return;
    let startPage, endPage;
    if (pageCount <= 3) {
        startPage = 1;
        endPage = pageCount;
    } else {
        if (currentPage <= 2) {
            startPage = 1;
            endPage = 3;
        } else if (currentPage >= pageCount - 1) {
            startPage = pageCount - 2;
            endPage = pageCount;
        } else {
            startPage = currentPage - 1;
            endPage = currentPage + 1;
        }
    }
    /*Xử lí nút bấm trang: xem trang nào đang hoạt động sẽ tô màu, mỗi nút sẽ có onclick để khi bấm chuyển trang sẽ gọi hàm renderCard
    Đây là một vòng lặp liên tục khi nó gọi renderCard, renderCard gọi setupPagination và setupPagination lại gọi createBtn*/
    const createBtn = (content, targetPage, isActive, isDisabled) => {
        const btn = document.createElement("button");
        btn.textContent = content;
        btn.className = `page-btn ${isActive ? "active" : ""}`;
        if (isDisabled) {
            btn.classList.add("disabled");
            btn.disabled = true;
        } else {
            btn.onclick = () => {
                currentPage = targetPage;
                renderCards(reviews);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            };
        }
        return btn;
    };
    /*Làm thêm hai nút qua trái và qua phải thanh số trang*/
    paginationContainer.appendChild(createBtn("<", currentPage - 1, false, currentPage === 1));
    for (let i = startPage; i <= endPage; i++) {
        paginationContainer.appendChild(createBtn(i, i, i === currentPage, false));
    }
    paginationContainer.appendChild(createBtn(">", currentPage + 1, false, currentPage === pageCount));
}
function calculateAverage(review) {
    /*Tính số sao trung bình từ 4 dữ liệu sao đánh giá trong reviewdetail*/
    return (review.serviceStar+review.hotelStar+review.tourguideStar+review.itineraryStar)/4;
}
function renderStars(rating, starFill) {
    /*Hàm này phục vụ việc đã có giá trị trung bình rồi sau đó sẽ tính ra phần trăm và cho tham số thứ hai là một class của thẻ html
    fill sao theo phần trăm áp dụng kỹ thuật css cho phép hai phần sao đè lên nhau với phần sao không màu nằm dưới
    và phần sao có màu ở trên*/
    let percent =(rating/5) *100;
    starFill.style.width=percent+"%";
}
backgroundimages=[
    "Source/rednebula.png",
    "Source/greennebula.png",
    "Source/bluenebula.png"
];
function createReviewElement(review,index) {
    /*Hàm này dùng để sinh một cấu trúc HTML là một thẻ đánh giá*/
    let mainDisplay=document.getElementById("mainDisplay");
    let reviewCard=document.createElement("article");
    reviewCard.className="review-card card-component";
    mainDisplay.appendChild(reviewCard);
    let cardBackground=document.createElement("div");
    cardBackground.className="card-component upper-container";
    let img=document.createElement("img");
    cardBackground.appendChild(img);
    img.className="upper-container img-background";
    /*Lấy ngẫu nhiên 1 ảnh trong mảng backgroundimages*/
    img.src=backgroundimages[Math.floor(Math.random()*backgroundimages.length)];
    let date=document.createElement("time");
    cardBackground.appendChild(date);
    date.dateTime=review.date;
    date.className="upper-container review-date";
    date.textContent=review.date;
    reviewCard.appendChild(cardBackground);
    let cardInfo=document.createElement("div");
    cardInfo.className="card-component info-container";
    reviewCard.appendChild(cardInfo);
    let infoLeftSpace=document.createElement("span");
    infoLeftSpace.className="info-container left";
    cardInfo.appendChild(infoLeftSpace);
    let placeName=document.createElement("div");
    placeName.className="info-container place-name";
    /*Đã có giá trị từ review nên chỉ cần lấy ra đúng tên có dấu rồi áp vào không cần chạy vòng lặp hay if else nhiều */
    placeName.textContent = placeNameMap[review.reviewPlace] || placeName.textContent;
    infoLeftSpace.appendChild(placeName);
    let starRating=document.createElement("div");
    starRating.className="star-rating-card";
    infoLeftSpace.appendChild(starRating);
    let starWrapper=document.createElement("div");
    starWrapper.className="stars-wrapper";
    starRating.appendChild(starWrapper);
    let starBg=document.createElement("div");
    starBg.className="star-bg";
    starBg.textContent="★★★★★";
    starWrapper.appendChild(starBg);
    let starFill=document.createElement("div");
    starFill.className="star-fill";
    starFill.textContent="★★★★★";
    starWrapper.appendChild(starFill);
    let avg=calculateAverage(review);
    renderStars(avg,starFill);
    let infoRightSpace=document.createElement("span");
    infoRightSpace.className="info-container right";
    cardInfo.appendChild(infoRightSpace);
    let reviewerName=document.createElement("div");
    reviewerName.className="info-container reviewer-name";
    reviewerName.textContent=review.reviewerName;
    infoRightSpace.appendChild(reviewerName);
    /*Gán cho mỗi phần tử được tạo một sự kiện khi bấm vào sẽ đi tới trang reviewdetail cùng với gửi id là reviewID cho trang đó
     phục vụ việc fill dữ liệu vào*/ 
    reviewCard.addEventListener("click", (e) => {
        e.preventDefault();
        document.body.classList.add("fade-out");
        setTimeout(() => {
            window.location.href = `reviewdetail.html?id=${review.reviewID}`;
        }, 400);
    });
}