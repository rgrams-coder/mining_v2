import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const BookDetails = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real application, this would fetch book details from an API
    // using the bookId parameter
    // For now, we'll simulate loading book data
    
    const fetchBookDetails = async () => {
      try {
        // Simulated API call delay
        setTimeout(() => {
          // Placeholder data
          setBook({
            id: bookId,
            title: "Sample Book Title",
            author: "Sample Author",
            publishedYear: 2023,
            description: "This is a placeholder description for the book. In a real application, this data would come from an API call.",
            coverImage: "https://via.placeholder.com/150",
            pages: 250,
            genre: "Fiction"
          });
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching book details:", error);
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  if (loading) {
    return <div className="book-details-loading">Loading book details...</div>;
  }

  if (!book) {
    return <div className="book-not-found">Book not found</div>;
  }

  return (
    <div className="book-details-container">
      <h1>{book.title}</h1>
      <div className="book-details-grid">
        <div className="book-image">
          <img src={book.coverImage} alt={book.title} />
        </div>
        <div className="book-info">
          <p><strong>Author:</strong> {book.author}</p>
          <p><strong>Published:</strong> {book.publishedYear}</p>
          <p><strong>Genre:</strong> {book.genre}</p>
          <p><strong>Pages:</strong> {book.pages}</p>
          <p className="book-description">{book.description}</p>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;