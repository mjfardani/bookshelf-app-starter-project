(() => {
    // Deklarasi variabel untuk menyimpan data buku
    let books = [];

    // Fungsi untuk menambahkan buku baru
    function addBook(event) {
        event.preventDefault();

        // Mengambil nilai dari form input sesuai struktur HTML
        const title = document.querySelector("#bookFormTitle").value;
        const author = document.querySelector("#bookFormAuthor").value;
        const year = Number(document.querySelector("#bookFormYear").value);  // Mengubah nilai tahun menjadi tipe number
        const isComplete = document.querySelector("#bookFormIsComplete").checked;

        // Membuat objek buku baru
        const book = {
            id: +new Date(),  // ID unik berdasarkan waktu
            title,
            author,
            year,
            isComplete
        };

        // Menyimpan buku ke dalam array `books` dan memperbarui tampilan
        books.push(book);
        document.dispatchEvent(new Event("bookChanged"));
    }

    // Fungsi untuk mencari buku berdasarkan judul
    function searchBook(event) {
        event.preventDefault();

        // Mengambil query pencarian dari input
        const query = document.querySelector("#searchBookTitle").value.toLowerCase();

        // Menyaring buku berdasarkan judul sesuai query pencarian
        const filteredBooks = query
            ? books.filter(book => book.title.toLowerCase().includes(query))
            : books;

        // Memperbarui tampilan dengan hasil pencarian
        renderBookshelf(filteredBooks);
    }

    // Fungsi untuk memindahkan buku ke rak "Selesai dibaca"
    function markBookAsComplete(event) {
        const bookId = Number(event.target.id);

        // Mencari buku berdasarkan ID dan memperbarui status `isComplete`
        const bookIndex = books.findIndex(book => book.id === bookId);
        if (bookIndex !== -1) {
            books[bookIndex].isComplete = true;
            document.dispatchEvent(new Event("bookChanged"));
        }
    }

    // Fungsi untuk memindahkan buku ke rak "Belum selesai dibaca"
    function markBookAsIncomplete(event) {
        const bookId = Number(event.target.id);

        // Mencari buku berdasarkan ID dan memperbarui status `isComplete`
        const bookIndex = books.findIndex(book => book.id === bookId);
        if (bookIndex !== -1) {
            books[bookIndex].isComplete = false;
            document.dispatchEvent(new Event("bookChanged"));
        }
    }

    // Fungsi untuk menghapus buku
    function deleteBook(event) {
        const bookId = Number(event.target.id);

        // Mencari buku berdasarkan ID dan menghapusnya dari array `books`
        const bookIndex = books.findIndex(book => book.id === bookId);
        if (bookIndex !== -1) {
            books.splice(bookIndex, 1);
            document.dispatchEvent(new Event("bookChanged"));
        }
    }

    // Fungsi untuk memperbarui tampilan rak buku
    function renderBookshelf(bookList) {
        const incompleteBookshelfList = document.querySelector("#incompleteBookList");
        const completeBookshelfList = document.querySelector("#completeBookList");

        incompleteBookshelfList.innerHTML = "";
        completeBookshelfList.innerHTML = "";

        // Looping untuk menampilkan setiap buku pada rak yang sesuai
        for (const book of bookList) {
            // Elemen kontainer buku
            const bookItem = document.createElement("div");
            bookItem.setAttribute("data-bookid", book.id);
            bookItem.setAttribute("data-testid", "bookItem");

            // Menambahkan kelas berdasarkan status isComplete
            bookItem.classList.add("book_item");
            if (book.isComplete) {
                bookItem.classList.add("complete");  // Tambahkan kelas 'complete' jika buku sudah selesai
            } else {
                bookItem.classList.add("incomplete"); // Tambahkan kelas 'incomplete' jika buku belum selesai
            }

            // Elemen judul, penulis, dan tahun
            const titleElement = document.createElement("h3");
            titleElement.setAttribute("data-testid", "bookItemTitle");
            titleElement.innerText = book.title;

            const authorElement = document.createElement("p");
            authorElement.setAttribute("data-testid", "bookItemAuthor");
            authorElement.innerText = "Penulis: " + book.author;

            const yearElement = document.createElement("p");
            yearElement.setAttribute("data-testid", "bookItemYear");
            yearElement.innerText = "Tahun: " + book.year;

            bookItem.appendChild(titleElement);
            bookItem.appendChild(authorElement);
            bookItem.appendChild(yearElement);

            // Menambahkan tombol aksi untuk buku (selesai dibaca, hapus, dan edit)
            const actionContainer = document.createElement("div");

            // Tombol berdasarkan status `isComplete`
            if (book.isComplete) {
                const incompleteButton = document.createElement("button");
                incompleteButton.id = book.id;
                incompleteButton.setAttribute("data-testid", "bookItemIsCompleteButton");  // Menambahkan data-testid
                incompleteButton.classList.add("complete");  // Menambahkan kelas untuk styling
                incompleteButton.innerText = "Belum Selesai dibaca";
                incompleteButton.addEventListener("click", markBookAsIncomplete);

                const deleteButton = document.createElement("button");
                deleteButton.id = book.id;
                deleteButton.setAttribute("data-testid", "bookItemDeleteButton");  // Menambahkan data-testid
                deleteButton.classList.add("delete");  // Menambahkan kelas untuk styling
                deleteButton.innerText = "Hapus buku";
                deleteButton.addEventListener("click", deleteBook);

                actionContainer.appendChild(incompleteButton);
                actionContainer.appendChild(deleteButton);
                bookItem.appendChild(actionContainer);

                completeBookshelfList.appendChild(bookItem);
            } else {
                const completeButton = document.createElement("button");
                completeButton.id = book.id;
                completeButton.setAttribute("data-testid", "bookItemIsCompleteButton");  // Menambahkan data-testid
                completeButton.classList.add("complete");
                completeButton.innerText = "Selesai dibaca";
                completeButton.addEventListener("click", markBookAsComplete);

                const deleteButton = document.createElement("button");
                deleteButton.id = book.id;
                deleteButton.setAttribute("data-testid", "bookItemDeleteButton");  // Menambahkan data-testid
                deleteButton.classList.add("delete");
                deleteButton.innerText = "Hapus buku";
                deleteButton.addEventListener("click", deleteBook);

                actionContainer.appendChild(completeButton);
                actionContainer.appendChild(deleteButton);
                bookItem.appendChild(actionContainer);

                incompleteBookshelfList.appendChild(bookItem);
            }
        }
    }

    // Fungsi untuk menyimpan data buku ke `localStorage`
    function saveBooks() {
        localStorage.setItem("books", JSON.stringify(books));
        renderBookshelf(books);
    }

    // Event listener untuk load dan menginisialisasi data
    window.addEventListener("load", () => {
        // Mengambil data buku dari localStorage
        books = JSON.parse(localStorage.getItem("books")) || [];

        // Mengubah tipe 'year' menjadi number untuk setiap buku
        books.forEach(book => {
            book.year = Number(book.year);  // Pastikan 'year' adalah number
        });

        // Menampilkan rak buku
        renderBookshelf(books);

        // Menambahkan event listener untuk form buku baru dan pencarian buku
        document.querySelector("#bookForm").addEventListener("submit", addBook);
        document.querySelector("#searchBook").addEventListener("submit", searchBook);

        // Menyimpan buku ke localStorage saat ada perubahan
        document.addEventListener("bookChanged", saveBooks);
    });

})();
