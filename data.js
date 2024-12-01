const appStoreAppId = "123";
const googleStoreAppId = "456";
const websiteLink = "https://langgomxike.github.io/app.langgomedu/";
const email = "langgomedus@gmail.com";
const title = "LanggomEdu - Kết nối gia sư và phụ huynh";
const subTitle = "LanggomEdu phát triển ứng dụng học và luyện thi tiếng Anh hiệu quả, có thể sử dụng miễn phí";

document.querySelector("#app-email").innerHTML = email;
document.querySelector("#app-title").innerHTML = title;
document.querySelector("#sub-title").innerHTML = subTitle;
document.querySelector("#app-store-link").setAttribute("href",`https://apps.apple.com/vn/app/apple-store/id${appStoreAppId}`);
document.querySelector("#google-store-link").setAttribute("href",`https://play.google.com/store/apps/details?id=${googleStoreAppId}`);
document.querySelector("#web-link").setAttribute("href", websiteLink);
