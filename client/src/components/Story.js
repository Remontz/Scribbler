import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import Nav from "./sections/Nav";
import Footer from "./sections/Footer";
import "../styles/story.css";

const Story = () => {
  const { storyId } = useParams();
  const [story, setStory] = useState({});
  const [authorName, setAuthorName] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const storyPageRef = useRef(null);
  const [maxCharsPerLine, setMaxCharsPerLine] = useState(50); // Initial value, adjust as needed
  const [paginatedContent, setPaginatedContent] = useState([""]);

  useEffect(() => {
    const fetchAuthorName = (authorId) => {
      story.author !== null && story.author === authorId
        ? axios
            .get(`/users/${authorId}`)
            .then((res) => {
              console.log("Author Name Response: ", res.data.username);
              setAuthorName(res.data.username);
            })
            .catch((err) => console.log(err))
        : console.log("Author Name not found");
    };

    axios
      .get(`/stories/${storyId}`)
      .then((res) => {
        console.log(res.data);
        setStory(res.data);
        fetchAuthorName(res.data.author);
      })
      .catch((err) => console.log(err));
  }, [storyId, story.author]);

  useEffect(() => {
    const calculateMaxCharsPerLine = () => {
      const storyPageElement = storyPageRef.current;
      if (!storyPageElement) return;

      const storyPageWidth = storyPageElement.clientWidth;
      // Define your logic for max characters per line based on storyPageWidth
      let newMaxCharsPerLine;
      if (storyPageWidth > 1400) {
        newMaxCharsPerLine = 500;
      } else if (storyPageWidth > 1000) {
        newMaxCharsPerLine = 25;
      } else if (storyPageWidth > 700) {
        newMaxCharsPerLine = 20;
      } else {
        newMaxCharsPerLine = 15;
      }

      setMaxCharsPerLine(newMaxCharsPerLine);
    };

    window.addEventListener("resize", calculateMaxCharsPerLine);
    calculateMaxCharsPerLine();

    // Cleanup
    return () => {
      window.removeEventListener("resize", calculateMaxCharsPerLine);
    };
  }, []);

  useEffect(() => {
    const contentText = story.content || "";

    // Calculate the number of characters per line based on maxCharsPerLine
    const linesPerPage = Math.floor(storyPageRef.current.clientHeight / 1.2); // Adjust line height as needed

    const charsPerLine = Math.floor(
      storyPageRef.current.clientWidth / maxCharsPerLine
    );

    const charsPerPage = charsPerLine * linesPerPage;

    const formattedPages = [];
    let currentPage = "";

    for (let i = 0; i < contentText.length; i++) {
      currentPage += contentText[i];

      if (currentPage.length >= charsPerPage) {
        formattedPages.push(currentPage);
        currentPage = "";
      }
    }

    if (currentPage.length > 0) {
      formattedPages.push(currentPage);
    }

    setPaginatedContent(formattedPages);
  }, [story.content, maxCharsPerLine]);

  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < paginatedContent.length - 1) {
      setCurrentPage((prevPage) => prevPage + 1);
    } else if (direction === "prev" && currentPage > 0) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const renderPageContent = () => {
    const content = paginatedContent[currentPage] || "";
    return <div className="paragraphStyle">{content}</div>;
  };

  return (
    <section>
      <Nav />
      <article className="storyStyle">
        <h2 className="headingStyle"> {story.title} </h2>
        <span>by {authorName} </span>
        <div className="flex-container">
          <div className="pagination">
            <button
              className="pagination-button"
              disabled={currentPage === 0}
              onClick={() => handlePageChange("prev")}
            >
              {"<<<"}
              <span className="caption">Prev Page</span>
            </button>
          </div>
          <div className="story-page" ref={storyPageRef}>
            {renderPageContent()}
          </div>
          <div className="pagination">
            <button
              className="pagination-button"
              disabled={currentPage === paginatedContent.length - 1}
              onClick={() => handlePageChange("next")}
            >
              {">>>"}
              <span className="caption">Next Page</span>
            </button>
          </div>
        </div>
      </article>
      <Footer />
    </section>
  );
};

export default Story;
