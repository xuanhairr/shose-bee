self.onmessage = function (e) {
    fetch('/api/hoa-don/get-all-hoadon')
        .then(response => {
            if (!response.ok) {
                throw new Error('Lỗi khi gọi API: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            self.postMessage(data);
        })
        .catch(error => {
            console.error('Lỗi khi gọi API:', error);
        });

};
