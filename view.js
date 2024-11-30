document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    const resultContainer = document.getElementById('resultContainer');
    const editModal = document.getElementById('editModal');
    const closeBtn = document.querySelector('.close-btn');
    const editForm = document.getElementById('editForm');

    // Search functionality
    searchButton.addEventListener('click', async function() {
        const nama = searchInput.value.trim();
        
        if (!nama) {
            alert('Masukkan nama untuk dicari');
            return;
        }

        try {
            const response = await fetch(`https://aduan1.sibumi.id/data/${nama}`);
            
            if (response.ok) {
                const data = await response.json();
                displayResults(data);
            } else {
                resultContainer.innerHTML = '<p>Data tidak ditemukan</p>';
            }
        } catch (error) {
            console.error('Error:', error);
            resultContainer.innerHTML = '<p>Terjadi kesalahan saat mencari data</p>';
        }
    });

    // Event delegation for delete and edit buttons
    resultContainer.addEventListener('click', async function(e) {
        if (e.target.classList.contains('delete-btn')) {
            await handleDelete(e);
        } else if (e.target.classList.contains('edit-btn')) {
            openEditModal(e);
        }
    });

    // Delete function
    async function handleDelete(e) {
        const dataId = e.target.getAttribute('data-id');
        
        try {
            const response = await fetch(`https://aduan1.sibumi.id/delete/${dataId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Data berhasil dihapus');
                resultContainer.innerHTML = '';
                searchInput.value = '';
            } else {
                alert('Gagal menghapus data');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Terjadi kesalahan saat menghapus data');
        }
    }

    // Open edit modal
    function openEditModal(e) {
        const dataId = e.target.getAttribute('data-id');
        const resultContainer = e.target.closest('.result-detail-container');
    
        // Pastikan resultContainer tidak null
        if (!resultContainer) {
            console.error('Container data tidak ditemukan');
            return;
        }
    
        // Ambil data dari dataset
        const nama = resultContainer.dataset.nama;
        const lokasi = resultContainer.dataset.lokasi;
        const deskripsi = resultContainer.dataset.deskripsi;
    
        // Set nilai input
        document.getElementById('editId').value = dataId;
        document.getElementById('editNama').value = nama;
        document.getElementById('editLokasi').value = lokasi;
        document.getElementById('editDeskripsi').value = deskripsi;
    
        editModal.style.display = 'block';
    }

    // Close modal
    closeBtn.onclick = function() {
        editModal.style.display = 'none';
    }

    // Edit form submission
    editForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);

        try {
            const response = await fetch(`https://aduan1.sibumi.id/update/${formData.get('id')}`, {
                method: 'PUT',
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                alert('Data berhasil diupdate');
                editModal.style.display = 'none';
                // Optionally refresh the search results
                searchButton.click();
            } else {
                alert('Gagal update data: ' + result.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Terjadi kesalahan');
        }
    });

    // Display results function
    function displayResults(data) {
        // Format waktu sesuai kebutuhan
        const waktuFormatted = new Date(data.waktu).toLocaleString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    
        let filesHtml = data.files.map(file => `
            <div class="file-item">
                <p>Nama File: ${file.nama_file}</p>
                <a href="https://aduan1.sibumi.id/${file.file_url}" target="_blank">Lihat File</a>
            </div>
        `).join('');
    
        resultContainer.innerHTML = `
            <div class="result-detail-container" 
                 data-id="${data.ID}"
                 data-nama="${data.nama}"
                 data-lokasi="${data.lokasi}"
                 data-waktu="${data.waktu}"
                 data-deskripsi="${data.deskripsi}">
                <div class="result-detail">
                    <strong>Nama:</strong> ${data.nama}
                </div>
                <div class="result-detail">
                    <strong>Lokasi:</strong> ${data.lokasi}
                </div>
                <div class="result-detail">
                    <strong>Waktu:</strong> ${waktuFormatted}
                </div>
                <div class="result-detail">
                    <strong>Deskripsi:</strong> ${data.deskripsi}
                </div>
                <div class="file-list">
                    <h4>File:</h4>
                    ${filesHtml}
                </div>
                <div class="action-buttons">
                    <button class="delete-btn" data-id="${data.ID}">Hapus Data</button>
                    <button class="edit-btn" data-id="${data.ID}">Edit Data</button>
                </div>
            </div>
        `;
    }
});