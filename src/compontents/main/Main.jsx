import { useContext, useEffect, useState } from 'react';
import './Main.css';
import man from '../../assets/user_icon-BYrw3k3X.png';
import section1 from '../../assets/5.png';
import section2 from '../../assets/download.png';
import section3 from '../../assets/recent.png';
import section4 from '../../assets/side.png';
import section5 from '../../assets/gallery_icon-DX7cOO5y.png';
import section6 from '../../assets/micro.png';
import section7 from '../../assets/44.png';
import star from '../../assets/star.png';
import { Context } from '../../context/Context';

const cardData = [
  {
    text: "Suggest beautiful places to see on an upcoming road trip",
    image: section1
  },
  {
    text: "Briefly summarize this concept: urban planning",
    image: section2
  },
  {
    text: "Brainstorm team bonding activities for our work retreat",
    image: section3
  },
  {
    text: "Tell me about React js and React native",
    image: section4
  }
];

function Main() {
  const {
    onSent,
    recentprompts,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    prevPrompts,
    setPrevPrompts,
    setRecentprompts,
  } = useContext(Context);

  const [currentPrompt, setCurrentPrompt] = useState('');
  const [formattedResult, setFormattedResult] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);


  useEffect(() => {
    if (resultData) {
      const formatted = formatResponse(resultData);
      setFormattedResult(formatted);
    }
  }, [resultData]);

  const formatResponse = (text) => {
    // تقسيم النص إلى فقرات
    const paragraphs = text.split('\n').filter(p => p.trim() !== '');
    
    // معالجة كل فقرة
    return paragraphs.map((paragraph, index) => {
      // تحويل العناوين إلى عناصر <h3>
      if (paragraph.startsWith('# ')) {
        return `<h3>${paragraph.substring(2)}</h3>`;
      }
      // تحويل النقاط إلى قائمة غير مرتبة
      if (paragraph.startsWith('- ')) {
        const items = paragraph.split('- ').filter(item => item.trim() !== '');
        return `<ul>${items.map(item => `<li>${item.trim()}</li>`).join('')}</ul>`;
      }
      // إضافة مسافة بادئة للفقرات العادية
      return `<p>${paragraph}</p>`;
    }).join('');
  };
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSend();
    }

  };
  const handleCardClick = (cardText) => {
    setInput(cardText);
    onSend();
  };

  const onSend = async () => {
    if (input.trim() === '') return; // Don't send empty input

    setCurrentPrompt(input); // Set current prompt to track the latest input
    await onSent(input);
    setRecentprompts(input); // Update recent prompts with the latest input
    setInput(''); // Clear input after sending
  };
  const toggleDropdown = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };
  return (
    <div className='main '>
      <div className='nav'>
        <p>Gemini</p>
        <img src={man} alt='' />
      </div>
      <div className='main-container'>
        {!showResult ? (
          <>
            <div className='greet'>
              <p>
                <span>Hello, Dev.</span>
              </p>
              <p>How can I help you today?</p>
            </div>

            <div className='cards'>
              {cardData.map((card, index) => (
                <div key={index} className='card' onClick={() => handleCardClick(card.text)}>
                  <p>{card.text}</p>
                  <img src={card.image} alt='' />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className='result'>
            <div className='result-title'>
              <img src={man} alt='' />
              <p>{recentprompts}</p>
            </div>
            <div className='result-data'>
              <img src={star} alt='' />
              {loading ? (
                <div className='loader'>
                  <hr />
                  <hr />
                  <hr />
                </div>
              ) : (
                <div className="formatted-result" dangerouslySetInnerHTML={{ __html: formattedResult }}></div>
              )}
            </div>
          </div>
        )}

        <div className='main-bottom mt-sm-4'>
        <div className='search-box'>
          <input
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            type='text'
            placeholder='Enter a Prompt here'
            value={input}
          />
          <div className='action-buttons'>
            <div className='action-button'>
              <img src={section5} alt='' onClick={() => toggleDropdown('upload')} />
              {activeDropdown === 'upload' && (
                {/* <div className='dropdown-menu'>
                  <div className='dropdown-item'>
                    <i className="fas fa-image"></i>
                    <span>Upload an image</span>
                  </div>
                  <div className='dropdown-item'>
                    <i className="fas fa-camera"></i>
                    <span>Take a photo</span>
                  </div>
                </div> */}
              )}
            </div>
            <div className='action-button'>
              <img src={section6} alt='' onClick={() => toggleDropdown('voice')} />
              {activeDropdown === 'voice' && (
                {/* <div className='dropdown-menu'>
                  <div className='dropdown-item'>
                    <i className="fas fa-microphone"></i>
                    <span>Start voice input</span>
                  </div>
                  <div className='dropdown-item'>
                    <i className="fas fa-cog"></i>
                    <span>Voice settings</span>
                  </div>
                </div> */}
              )}
            </div>
            <img onClick={onSend} src={section7} alt='' />
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default Main;