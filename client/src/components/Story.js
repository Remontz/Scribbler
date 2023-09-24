import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import Nav from './sections/Nav';
import Footer from './sections/Footer';
import { split } from 'sentence-splitter';
import '../styles/story.css';

const Story = () => {
    const { storyId } = useParams();
    const [story, setStory] = useState({});
    const [authorName, setAuthorName] = useState('');
    const [currentPage, setCurrentPage] = useState(0); // Store current page
    const storyPageRef = useRef(null); // Ref to story page div
    const [linesPerPage, setLinesPerPage] = useState(1); // Store lines per page
    const [paginatedContent, setPaginatedContent] = useState(['']); // Store paginated content

    useEffect(() => {
        // Fetch Author Name if story.author is not null && story.author is equal to authorId
        const fetchAuthorName = (authorId) => {
            (story.author !== null && story.author === authorId) ?
                axios.get(`/users/${authorId}`)
                    .then(res => {
                        console.log('Author Name Response: ', res.data.username);
                        setAuthorName(res.data.username);
                    })
                    .catch(err => console.log(err))
                : console.log('Author Name not found');
        };

        // Fetch story by ID
        axios.get(`/stories/${storyId}`)
            .then(res => {
                console.log(res.data);
                setStory(res.data);

                // Fetch Author Name
                fetchAuthorName(res.data.author);
            })
            .catch(err => console.log(err));
    }, [storyId, story.author]);

    useEffect(() => {
        // Update lines per page
        const calculateLinesPerPage = () => {
            const storyPageElement = storyPageRef.current;
            if (!storyPageElement) return;

            const maxHeight = storyPageElement.clientHeight;
            const lineHeight = 20; // Adjust this value as needed
            const calculatedLinesPerPage = Math.floor(maxHeight / lineHeight);

            setLinesPerPage(calculatedLinesPerPage);
        };

        // Recalculate lines per page on window resize
        window.addEventListener('resize', calculateLinesPerPage);
        calculateLinesPerPage();
    }, []);

    useEffect(() => {
        // Break content into sentences using sentence-splitter
        const contentText = story.content || '';
        const sentences = split(contentText).map(sentence => sentence.raw);

        // Calculate paginated content
        const pages = [];
        let currentPage = '';
        let currentLineCount = 0;

        sentences.forEach(sentence => {
            const sentenceLineCount = sentence.split('\n').length;

            if (currentLineCount + sentenceLineCount <= linesPerPage) {
                currentPage += sentence + ' ';
                currentLineCount += sentenceLineCount;
            } else {
                pages.push(currentPage.trim());
                currentPage = sentence + ' ';
                currentLineCount = sentenceLineCount;
            }
        });

        // Push the last page if it's not empty
        if (currentPage.trim().length > 0) {
            pages.push(currentPage.trim());
        }

        setPaginatedContent(pages);
    }, [story.content, linesPerPage]);

    // Handle page change
    const handlePageChange = (e) => {
        e.preventDefault();
        const { name } = e.target;

        if (name === 'Next Page' && currentPage < paginatedContent.length - 1) {
            setCurrentPage(prevPage => prevPage + 1);
        } else if (name === 'Prev Page' && currentPage > 0) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    const renderPageContent = () => {
        return (
            <div className='paragraphStyle'>
                {paginatedContent[currentPage]}
            </div>
        );
    };

    return (
        <section>
            <Nav />
            <article className='storyStyle'>
                <h2 className='headingStyle'> {story.title} </h2>
                <span>by {authorName} </span>
                <div className='story-page' ref={storyPageRef}>
                    {renderPageContent()}
                </div>
                <div className='pagination'>
                    <button disabled={currentPage === 0} name='Prev Page' onClick={handlePageChange}> Prev Page </button>
                    <button disabled={currentPage === paginatedContent.length - 1} name='Next Page' onClick={handlePageChange}> Next Page </button>
                </div>
            </article>
            <Footer />
        </section>
    );
};

export default Story;
