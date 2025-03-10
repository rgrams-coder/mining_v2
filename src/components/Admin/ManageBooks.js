import React, { useState, useEffect } from 'react';

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    description: '',
    publicationYear: '',
    isbn: ''
  });

  useEffect(() => {
    // Fetch books from API when component mounts
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      const response = await fetch('/api/books');
      if (!response.ok) throw new Error('Failed to fetch books');
      
      const data = await response.json();
      setBooks(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to add book');
      
      // Reset form and refresh book list
      setFormData({
        title: '',
        author: '',
        genre: '',
        description: '',
        publicationYear: '',
        isbn: ''
      });
      fetchBooks();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteBook = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        const response = await fetch(`/api/books/${bookId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) throw new Error('Failed to delete book');
        
        // Refresh book list
        fetchBooks();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) return <div className="loading">Loading books...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="manage-books container mt-4">
      <h1>Manage Books</h1>
      
      <div className="row mt-4">
        <div className="col-md-5">
          <h2>Add New Book</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Title</label>
              <input 
                type="text" 
                className="form-control" 
                id="title" 
                name="title" 
                value={formData.title} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="author" className="form-label">Author</label>
              <input 
                type="text" 
                className="form-control" 
                id="author" 
                name="author" 
                value={formData.author} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="genre" className="form-label">Genre</label>
              <input 
                type="text" 
                className="form-control" 
                id="genre" 
                name="genre" 
                value={formData.genre} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea 
                className="form-control" 
                id="description" 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange} 
                rows="3" 
                required 
              ></textarea>
            </div>
            
            <div className="mb-3">
              <label htmlFor="publicationYear" className="form-label">Publication Year</label>
              <input 
                type="number" 
                className="form-control" 
                id="publicationYear" 
                name="publicationYear" 
                value={formData.publicationYear} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="isbn" className="form-label">ISBN</label>
              <input 
                type="text" 
                className="form-control" 
                id="isbn" 
                name="isbn" 
                value={formData.isbn} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            
            <button type="submit" className="btn btn-primary">Add Book</button>
          </form>
        </div>
        
        <div className="col-md-7">
          <h2>Book List</h2>
          {books.length === 0 ? (
            <p>No books available.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Genre</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map(book => (
                    <tr key={book.id}>
                      <td>{book.title}</td>
                      <td>{book.author}</td>
                      <td>{book.genre}</td>
                      <td>
                        <button className="btn btn-sm btn-primary me-2">Edit</button>
                        <button 
                          className="btn btn-sm btn-danger" 
                          onClick={() => deleteBook(book.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageBooks;