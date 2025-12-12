self.onmessage = function (e) {
    fetch('/api/get-all-san-pham')
        .then(response => response.json())
        .then(data => {
            self.postMessage(data);
        })
        .catch(error => {
            console.error("Lỗi khi gọi API: ", error);
        });
};
