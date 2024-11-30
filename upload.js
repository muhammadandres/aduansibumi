document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('uploadForm');

    uploadForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);

        try {
            const response = await fetch('https://aduan1.sibumi.id/upload', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                alert('Data berhasil diupload');
                this.reset();
            } else {
                alert('Gagal upload data: ' + result.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Terjadi kesalahan');
        }
    });
});