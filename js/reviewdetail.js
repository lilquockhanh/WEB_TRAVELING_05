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
});
function calculateAverage(review) {
    return (review.serviceStar+review.hotelStar+review.tourguideStar+review.itineraryStar)/4;
    /*Tính giá trị trung bình sao dùng với mục đích fill sao theo phần trăm*/
}
function renderStars(rating, starFill) {
    let percent =(rating/5) *100;
    starFill.style.width=percent+"%";
    /*Lấy phần trăm fill sao*/
}
function getFormData() {
    let form=document.querySelector(".review-form");
    form.addEventListener('submit',e=>{
        e.preventDefault();
        /*Khi bấm submit sẽ kiểm tra một lần nếu class nào còn error thì không được phép submit mà sẽ có hiệu ứng đẩy lên lại trung tâm*/
        checkReviewerName();
        checkReviewPlace();
        checkServiceStar();
        checkHotelStar();
        checktourguideStar();
        checkItineraryStar();
        let hasError=form.querySelector(".error");
        if (hasError) {
            //alert("Vui lòng điền đầy đủ các thông tin bắt buộc!");
            hasError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
        /*Lấy tồn bộ mảng localStorage và kiểm tra xem reviewID lớn nhất và cho reviewID của phần tử được tạo lần này là
        reviewID lớn nhất cộng 1(vì vấn đề ý tưởng nên làm vậy)*/
        let allReviews=JSON.parse(localStorage.getItem("reviews"))||[];
        let maxID=0;
        for (let review of allReviews) {
            if (review.reviewID>maxID) {
                maxID=review.reviewID;
            }
        }
        let newReviewID=maxID+1;
        let formData=new FormData(form);
        let newReview={
            reviewID: newReviewID,
            reviewerName: formData.get("reviewerName"),
            reviewPlace: formData.get("reviewPlace"),
            serviceStar: parseInt(formData.get("serviceStar")),
            hotelStar: parseInt(formData.get("hotelStar")),
            tourguideStar : parseInt(formData.get("tourguideStar")),
            itineraryStar : parseInt(formData.get("itineraryStar")),
            detail: formData.get("detailBox"),
            date:new Date().toISOString().split("T")[0]
        };
        /*Lấy dữ liệu từ form và thêm dữ liệu đó vào đầu mảng localStorage (vì ý tưởng hiển thị)*/
        let reviews=JSON.parse(localStorage.getItem("reviews"))||[];
        reviews.unshift(newReview);
        localStorage.setItem("reviews",JSON.stringify(reviews));
        form.reset();
        alert("Cảm ơn bạn đã đánh giá");
        /*Khi submit có hiệu ứng chuyển về */
        document.body.classList.add("fade-out");
        setTimeout(() => {
            window.location.href = "review.html";
        }, 400);
    });
}
getFormData();
function getReviewFromQuery() {
    let params = new URLSearchParams(window.location.search); /*lấy tham số trên thanh địa chỉ cụ thể là id*/
    let reviewID = params.get("id"); // Lấy từ query ?id=...
    if (reviewID === null) return null; 
    reviewID = parseInt(reviewID); // Chuyển sang số
    let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
    // Tìm review có reviewID khớp
    return reviews.find(r => r.reviewID === reviewID) || null;
}
function displayReviewDetail() {
    let review = getReviewFromQuery();
    if (!review) return;
    /*Điền dữ liệu lấy được vào các ô*/
    document.getElementById("reviewer-name").value = review.reviewerName;
    document.getElementById("review-place").value = review.reviewPlace;
    document.querySelectorAll('input[name="serviceStar"]').forEach(input => {
        input.checked = parseInt(input.value) === review.serviceStar;
    });
    document.querySelectorAll('input[name="hotelStar"]').forEach(input => {
        input.checked = parseInt(input.value) === review.hotelStar;
    });
    document.querySelectorAll('input[name="tourguideStar"]').forEach(input => {
        input.checked = parseInt(input.value) === review.tourguideStar;
    });
    document.querySelectorAll('input[name="itineraryStar"]').forEach(input => {
        input.checked = parseInt(input.value) === review.itineraryStar;
    });
    /*Lúc viết đánhg giá không hiện ngày nhưng khi vào xem thì sẽ có thông phần ngày viết đánh giá*/
    let dateContainer = document.querySelector(".date-review-container");
    if(dateContainer){
        dateContainer.style.display="block";
        document.getElementById("review-date").textContent = review.date;
        document.getElementById("review-date").dateTime = review.date;
    }
    document.getElementById("detail").value = review.detail;
    /*Ẩn hết chức năng của các phần nhập, chọn vì đây là xem không được đụng vào*/
    document.querySelector(".review-form").querySelectorAll("input,select,textarea")
        .forEach(el => el.disabled = true);
    /*Ẩn đi nút gửi và tạo nút back về thêm nút back vào cây DOM*/
    let oldSubmit = document.querySelector(".review-form button[type='submit']");
    if (oldSubmit) oldSubmit.style.display = "none";
    let backButton=document.createElement("button");
    backButton.className="back-button";
    backButton.textContent="Back";
    document.querySelector(".review-form").appendChild(backButton);
    /*Thêm event khi bấm nút back sẽ có hiệu ứng chuyển trang*/
    backButton.addEventListener("click", function(e){
        e.preventDefault();
        document.body.classList.add("fade-out");
        setTimeout(()=>{
            backButton.remove();
            window.location.href="review.html";
        },400);
    });
}
/*Các hàm phía sau lấy cảm hứng từ thầy*/
window.addEventListener("DOMContentLoaded", displayReviewDetail);
function errorMessage(elm) {
    let componentContainer=elm.parentElement;
    if (componentContainer.classList.contains('success')) {
        componentContainer.classList.remove('success');
        componentContainer.classList.add('error');
    } else {
        componentContainer.classList.add('error');
    }
}
function successMessage(elm) {
    let componentContainer=elm.parentElement;
    if (componentContainer.classList.contains('error')) {
        componentContainer.classList.remove('error');
        componentContainer.classList.add('success');
    } else {
        componentContainer.classList.add('success');
    }
}
function checkReviewerName() {
    let input=document.getElementById("reviewer-name");
    let hotenchuan=input.value.trim();
    if (hotenchuan==="") {
        errorMessage(input);
    } else {
        successMessage(input);
    }
}
function checkReviewPlace(){
    let selected=document.getElementById("review-place");
    if (selected.value==="") {
        errorMessage(selected);
    } else {
        successMessage(selected);
    }
}
function checkServiceStar() {
    let starSelected=document.querySelector('input[name="serviceStar"]:checked');
    if (starSelected===null) {
        let inputSample=document.getElementsByName("serviceStar")[0];
        errorMessage(inputSample);
    } else {
        successMessage(starSelected);
    }
}
function checkHotelStar() {
    let starSelected=document.querySelector('input[name="hotelStar"]:checked');
    if (starSelected===null) {
        let inputSample=document.getElementsByName("hotelStar")[0];
        errorMessage(inputSample);
    } else {
        successMessage(starSelected);
    }
}
function checktourguideStar(){
    let starSelected=document.querySelector('input[name="tourguideStar"]:checked');
    if (starSelected===null) {
        let inputSample=document.getElementsByName("tourguideStar")[0];
        errorMessage(inputSample);
    } else {
        successMessage(starSelected);
    }
}
function checkItineraryStar(){
    let starSelected=document.querySelector('input[name="itineraryStar"]:checked');
    if (starSelected===null) {
        let inputSample=document.getElementsByName("itineraryStar")[0];
        errorMessage(inputSample);
    } else {
        successMessage(starSelected);
    }
}
document.getElementById("reviewer-name").addEventListener("input",checkReviewerName);
document.getElementById("review-place").addEventListener("change",checkReviewPlace);
document.querySelectorAll('input[name="serviceStar"]').forEach(input => {
    input.addEventListener("change", checkServiceStar);
});
document.querySelectorAll('input[name="hotelStar"]').forEach(input => {
    input.addEventListener("change", checkHotelStar);
});
document.querySelectorAll('input[name="tourguideStar"]').forEach(input => {
    input.addEventListener("change", checktourguideStar);
});
document.querySelectorAll('input[name="itineraryStar"]').forEach(input => {
    input.addEventListener("change", checkItineraryStar);
});