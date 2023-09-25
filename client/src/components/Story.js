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
  const [linesPerPage, setLinesPerPage] = useState(1);
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
    const calculateLinesPerPage = () => {
      const storyPageElement = storyPageRef.current;
      if (!storyPageElement) return;
      const maxHeight = storyPageElement.clientHeight;
      const lineHeight = 1;
      const calculatedLinesPerPage = Math.floor(maxHeight / lineHeight);
      setLinesPerPage(calculatedLinesPerPage);
    };

    window.addEventListener("resize", calculateLinesPerPage);
    calculateLinesPerPage();
  }, []);

  useEffect(() => {
    const contentText = story.content || '';
    const sentences = contentText.split(/(?<=[.!?])\s+(?=[A-Z])/);
    console.log('Sentences: ', sentences)

    const formattedPages = [];
    let currentPage = '';
    let currentLineCount = 0;

    sentences.forEach(sentence => {
        console.log('Original Sentence: ', sentence)
        const sentenceLineCount = sentence.split('\n').length;

        if (currentLineCount + sentenceLineCount <= linesPerPage) {
            currentPage += sentence + ' ';
            currentLineCount += sentenceLineCount;
        } else {
            formattedPages.push(currentPage.trim()); // Push the current page
            currentPage = sentence + ' ';
            currentLineCount = sentenceLineCount;
        }
    });

    if (currentPage.trim().length > 0) {
        formattedPages.push(currentPage.trim()); // Push the last page
    }

    // Split pages into paragraphs while retaining double-spaces
    const formattedContent = formattedPages.map(page => {
        const paragraphs = page.split(/\n\n+/); // Split on one or more double-spaces
        return paragraphs.join('\n\n'); // Retain one double-space between paragraphs
    });

    console.log('Formatted Content: ', formattedContent);

    setPaginatedContent(formattedContent);
}, [story.content, linesPerPage]);





  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < paginatedContent.length - 1) {
      setCurrentPage((prevPage) => prevPage + 1);
    } else if (direction === "prev" && currentPage > 0) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const renderPageContent = () => {
    const content = paginatedContent[currentPage] || '';
    const contentWithLineBreaks = content.replace(/\n\n/g, '<br>')
    return (
        <div 
            className="paragraphStyle"
            dangerouslySetInnerHTML={{ __html: contentWithLineBreaks }}
        />
    );
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
